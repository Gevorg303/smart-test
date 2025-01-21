package com.example.smart_test.service;

import com.example.smart_test.domain.*;
import com.example.smart_test.dto.UserClassDto;
import com.example.smart_test.dto.UserDto;
import com.example.smart_test.mapper.api.UserMapperInterface;
import com.example.smart_test.repository.*;
import com.example.smart_test.request.UserRequest;
import com.example.smart_test.service.api.UserClassServiceInterface;
import com.example.smart_test.service.api.UserEducationalInstitutionServiceInterface;
import com.example.smart_test.service.api.UserServiceInterface;
import com.github.javafaker.Faker;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
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
    private UserClassServiceInterface userClassService;

    @Transactional
    @Override
    public void addUser(List<UserRequest> userRequestList) {
        for (UserRequest userRequest : userRequestList) {
            try {
                validateUserRequest(userRequest);

                User newUser = userRepository.save(prepareUserEntity(userRequest));

                linkUserToEducationalInstitution(userRequest, newUser);
                linkUserToStudentClass(userRequest, newUser);
            } catch (RuntimeException e) {
                throw new RuntimeException("Ошибка при добавлении пользователя: " + e.getMessage(), e);
            }
        }
    }

    private void validateUserRequest(UserRequest userRequest) {
        if (userRequest.getEducationalInstitution().getId() == null) {
            throw new RuntimeException("ID учебного заведения обязательно");
        }
        if (userRequest.getUser() == null || userRequest.getUser().getRole() == null || userRequest.getUser().getRole().getId() == null) {
            throw new RuntimeException("Некорректные данные пользователя");
        }
    }

    private User prepareUserEntity(UserRequest userRequest) {
        userRequest.getUser().setLogin(generateLogin(userRequest.getUser()));
        String rawPassword = generatePassword();
        userRequest.getUser().setPassword(rawPassword);
        userRequest.getUser().setPasswordEncoder(passwordEncoder.encode(rawPassword));

        User userEntity = userMapper.toEntity(userRequest.getUser());

        Role role = roleRepositoryInterface.findById(userRequest.getUser().getRole().getId())
                .orElseThrow(() -> new RuntimeException("Роль не найдена"));
        userEntity.setRoles(role);

        return userEntity;
    }

    private void linkUserToEducationalInstitution(UserRequest userRequest, User newUser) {
        EducationalInstitution educationalInstitution = educationalInstitutionRepository.findById(userRequest.getEducationalInstitution().getId())
                .orElseThrow(() -> new RuntimeException("Учебное заведение не найдено"));
        userEducationalInstitutionService.addUserEducationalInstitution(new UserEducationalInstitution(newUser, educationalInstitution));
    }

    private void linkUserToStudentClass(UserRequest userRequest, User newUser) {
        if (userRequest.getStudentClass().getId() != null) {
            StudentClass studentClass = studentClassRepository.findById(userRequest.getStudentClass().getId())
                    .orElseThrow(() -> new RuntimeException("Класс не найден"));
            userClassService.addUserClass(new UserClass(studentClass, newUser));
        }
    }

    @Override
    @Transactional
    public void deleteUser(UserDto userDto) {
        userRepository.deleteById(userDto.getId());
    }

    @Override
    @Transactional
    public List<UserDto> getAllUsers() {
        List<User> userEntities = userRepository.findAll();
        return userEntities.stream()
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserDto getUserByLogin(UserDto userDto) {
        User userEntity = userRepository.findById(userDto.getId())
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
        int id = userRepository.maxIdUser() + 1;
        return surnameInitials + nameInitials + patronymicInitials + id;
    }

    private String generatePassword() {
        Faker faker = new Faker();
        return faker.internet().password(8, 16, true, true, true);
    }
}
