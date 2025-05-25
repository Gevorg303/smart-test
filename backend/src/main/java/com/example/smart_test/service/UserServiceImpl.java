package com.example.smart_test.service;

import com.example.smart_test.domain.*;
import com.example.smart_test.dto.EducationalInstitutionDto;
import com.example.smart_test.dto.RoleDto;
import com.example.smart_test.dto.StudentClassDto;
import com.example.smart_test.dto.UserDto;
import com.example.smart_test.enums.UserRoleEnum;
import com.example.smart_test.mapper.api.EducationalInstitutionMapperInterface;
import com.example.smart_test.mapper.api.StudentClassMapperInterface;
import com.example.smart_test.mapper.api.UserMapperInterface;
import com.example.smart_test.repository.*;
import com.example.smart_test.request.UserBiRoleRequest;
import com.example.smart_test.request.UserRequest;
import com.example.smart_test.response.UserResponse;
import com.example.smart_test.service.api.UserClassServiceInterface;
import com.example.smart_test.service.api.UserEducationalInstitutionServiceInterface;
import com.example.smart_test.service.api.UserServiceInterface;
import com.github.javafaker.Faker;
import com.nimbusds.jose.util.Pair;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class UserServiceImpl implements UserServiceInterface {
    @Autowired
    private UserRepositoryInterface userRepository;
    @Autowired
    private RoleRepositoryInterface roleRepositoryInterface;
    @Autowired
    private UserMapperInterface userMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserEducationalInstitutionServiceInterface userEducationalInstitutionService;
    @Autowired
    private EducationalInstitutionRepositoryInterface educationalInstitutionRepository;
    @Autowired
    private StudentClassRepositoryInterface studentClassRepository;
    @Autowired
    @Lazy
    private UserClassServiceInterface userClassService;
    @Autowired
    private StudentClassMapperInterface studentClassMapper;
    @Autowired
    private EducationalInstitutionMapperInterface educationalInstitutionMapper;

    @Transactional
    @Override
    public List<UserResponse> addUser(List<UserRequest> userRequestList, UserDto admin) {
        List<UserResponse> registeredUsers = new ArrayList<>();

        for (UserRequest userRequest : userRequestList) {
            try {
                //validateUserRequest(userRequest);

                Pair<User, String> userWithPassword = prepareUserEntity(userRequest);
                User newUser = userRepository.save(userWithPassword.getLeft());
                String rawPassword = userWithPassword.getRight();

                linkUserToEducationalInstitution(userRequest, newUser, admin);
                if (UserRoleEnum.STUDENT.getDescription().equals(newUser.getRoles().getRole())) {
                    linkUserToStudentClass(userRequest, newUser);
                }
                registeredUsers.add(new UserResponse(
                        newUser.getLogin(),
                        rawPassword,
                        newUser.getEmail(),
                        newUser.getName(),
                        newUser.getPatronymic(),
                        newUser.getSurname()));

            } catch (RuntimeException e) {
                throw new RuntimeException("Ошибка при добавлении пользователя: " + e.getMessage(), e);
            }
        }

        return registeredUsers;
    }


    private void validateUserRequest(UserRequest userRequest) {
        if (userRequest.getEducationalInstitution().getId() == null) {
            throw new RuntimeException("ID учебного заведения обязательно");
        }
        if (userRequest.getUser() == null || userRequest.getUser().getRole() == null || userRequest.getUser().getRole().getId() == null) {
            throw new RuntimeException("Некорректные данные пользователя");
        }
    }

    private Pair<User, String> prepareUserEntity(UserRequest userRequest) {
        userRequest.getUser().setLogin(generateLogin(userRequest.getUser()));
        String rawPassword = generatePassword();
        userRequest.getUser().setPasswordEncoder(passwordEncoder.encode(rawPassword));

        User userEntity = userMapper.toEntity(userRequest.getUser());

        Role role = roleRepositoryInterface.findById(userRequest.getUser().getRole().getId())
                .orElseThrow(() -> new RuntimeException("Роль не найдена"));
        userEntity.setRoles(role);

        return Pair.of(userEntity, rawPassword);
    }

    private void linkUserToEducationalInstitution(UserRequest userRequest, User newUser, UserDto admin) {
        if (userRequest.getStudentClass() != null) {
            StudentClass studentClass = studentClassRepository.findById(userRequest.getStudentClass().getId()).orElse(null);
            assert studentClass != null;
            EducationalInstitution educationalInstitution = educationalInstitutionRepository.findById(studentClass.getEducationalInstitution().getId())
                    .orElseThrow(() -> new RuntimeException("Учебное заведение не найдено"));
            userEducationalInstitutionService.addUserEducationalInstitution(new UserEducationalInstitution(newUser, educationalInstitution));
        } else if (admin != null) {
            EducationalInstitutionDto educationalInstitution = findEducationalInstitutionByUser(admin);
            userEducationalInstitutionService.addUserEducationalInstitution(new UserEducationalInstitution(newUser, educationalInstitutionMapper.toEntity(educationalInstitution)));
        }
    }

    private void linkUserToStudentClass(UserRequest userRequest, User newUser) {
        if (userRequest.getStudentClass() != null && userRequest.getStudentClass().getId() != null) {
            StudentClass studentClass = studentClassRepository.findById(userRequest.getStudentClass().getId())
                    .orElseThrow(() -> new RuntimeException("Класс не найден"));
            userClassService.addUserClass(new UserClass(studentClass, newUser));
        }
    }

    @Override
    @Transactional
    public void deleteUser(UserDto userDto) {
        User user = userRepository.getReferenceById(userDto.getId());
        user.setIsDelete(true);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public List<UserDto> getAllUsers(UserDto userDto) {

        List<User> userEntities = userRepository.findAll();
        return userEntities.stream()
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserDto getUserByLogin(User user) {
        User userEntity = userRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Пользователь с таким логином не найден"));
        return userMapper.toDTO(userEntity);
    }

    @Override
    public User getUserByLogin(String login) {
        User userEntity = userRepository.findByLogin(login)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь с таким логином не найден"));
        return userEntity;
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentLogin = authentication.getName();
        return userRepository.findByLogin(currentLogin)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь с таким логином не найден"));
    }

    private String generateLogin(UserDto dto) {
        String surnameInitials = dto.getSurname().substring(0, Math.min(dto.getSurname().length(), 2));
        String nameInitials = dto.getName().substring(0, Math.min(dto.getName().length(), 2));
        String patronymicInitials = "";
        if (dto.getPatronymic() != null && !dto.getPatronymic().isEmpty()) {
            patronymicInitials = dto.getPatronymic().substring(0, Math.min(dto.getPatronymic().length(), 2));
        }
        int id = Optional.ofNullable(userRepository.maxIdUser()).orElse(0) + 1;
        return surnameInitials + nameInitials + patronymicInitials + id;
    }

    private String generatePassword() {
        Faker faker = new Faker();
        return faker.internet().password(8, 16, true, true, true);
    }

    @Override
    public List<StudentClassDto> findStudentClassByUser(UserDto userDto) {
        List<StudentClass> studentClassList = userEducationalInstitutionService.findUserEducationalInstitutionByUser(userDto);
        List<StudentClassDto> studentClassDtoList = new ArrayList<>();
        for (StudentClass studentClass : studentClassList) {
            studentClassDtoList.add(studentClassMapper.toDTO(studentClass));
        }
        return studentClassDtoList;
    }

    @Override
    public List<UserDto> getUser(UserDto userDto, RoleDto roleDto) {
        List<User> userList = userEducationalInstitutionService.getUsersByEducationalInstitutionExcludingSelf(userDto.getId());

        if (roleDto != null && roleDto.getId() != null) {
            Long roleId = roleDto.getId();
            userList = userList.stream()
                    .filter(user -> user.getRoles() != null && user.getRoles().getId().equals(roleId) && !user.getIsDelete())
                    .collect(Collectors.toList());
        }

        return userList.stream()
                .filter(user -> !user.getIsDelete())
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EducationalInstitutionDto findEducationalInstitutionByUser(UserDto userDto) {
        return userEducationalInstitutionService.findEducationalInstitutionByUser(userDto);
    }
}
