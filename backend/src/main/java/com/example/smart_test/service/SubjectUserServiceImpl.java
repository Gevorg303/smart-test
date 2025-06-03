package com.example.smart_test.service;


import com.example.smart_test.domain.*;
import com.example.smart_test.dto.*;
import com.example.smart_test.enums.UserRoleEnum;
import com.example.smart_test.mapper.api.StudentClassMapperInterface;
import com.example.smart_test.mapper.api.SubjectMapperInterface;
import com.example.smart_test.mapper.api.SubjectUserMapperInterface;
import com.example.smart_test.mapper.api.UserMapperInterface;
import com.example.smart_test.repository.StudentClassRepositoryInterface;
import com.example.smart_test.repository.SubjectUserRepositoryInterface;
import com.example.smart_test.repository.UserClassRepositoryInterface;
import com.example.smart_test.response.ClassStatusResponse;
import com.example.smart_test.request.SubjectClassRequest;
import com.example.smart_test.service.api.StudentClassServiceInterface;
import com.example.smart_test.service.api.SubjectUserServiceInterface;
import com.example.smart_test.service.api.UserEducationalInstitutionServiceInterface;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class SubjectUserServiceImpl implements SubjectUserServiceInterface {

    @Autowired
    private SubjectUserRepositoryInterface subjectUserRepositoryInterface;
    @Autowired
    private SubjectUserMapperInterface subjectUserMapperInterface;
    @Autowired
    private StudentClassMapperInterface studentClassMapper;
    @Autowired
    private SubjectMapperInterface subjectMapper;
    @Autowired
    private UserClassRepositoryInterface userClassRepository;
    @Autowired
    private UserMapperInterface userMapper;
    @Autowired
    private StudentClassRepositoryInterface studentClassRepository;
    @Autowired
    private StudentClassServiceInterface studentClassService;
    @Autowired
    private UserEducationalInstitutionServiceInterface userEducationalInstitutionService;

    @Override
    @Transactional
    public void addSubjectUserDto(SubjectClassRequest request) {
        try {
            Set<Long> existingUserIds = getUsersBySubject(request.getSubject())
                    .stream()
                    .map(UserDto::getId)
                    .collect(Collectors.toSet());

            for (StudentClassDto studentClassDto : request.getStudentClassDtoList()) {
                Set<User> users = getUsersByClass(studentClassMapper.toEntity(studentClassDto));

                for (User user : users) {
                    if (!existingUserIds.contains(user.getId())) {
                        subjectUserRepositoryInterface.save(new SubjectUser(subjectMapper.toEntity(request.getSubject()), user));
                        existingUserIds.add(user.getId());
                    }
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при добавлении связи 'Пользователь_предмет': " + e.getMessage(), e);
        }
    }


    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteSubjectUserDto(SubjectDto dto) {
        subjectUserRepositoryInterface.deleteBySubjectId(dto.getId());
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<SubjectUserDto> getAllSubjectTeachers() {
        try {
            List<SubjectUser> subjectTeachers = subjectUserRepositoryInterface.findAll();
            return subjectTeachers.stream()
                    .map(subjectUserMapperInterface::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при получении всех связей 'Полльзователь_предмет': " + e.getMessage(), e);
        }
    }

    @Transactional
    @Override
    public List<SubjectUser> findByUserId(UserDto user) {
        return subjectUserRepositoryInterface.findByUserId(user.getId());
    }

    private boolean findSubjectUserById(Long id) {
        Optional<SubjectUser> subjectTeacher = subjectUserRepositoryInterface.findById(id);
        return subjectTeacher.isPresent();
    }

    @Transactional
    @Override
    public Set<SubjectDto> getSubjectsByUsers(List<User> users) {
        List<SubjectUser> subjectUsers = subjectUserRepositoryInterface.findByUserIn(users);

        return subjectUsers.stream()
                .map(subjectUser -> subjectMapper.toDTO(subjectUser.getSubject()))
                .collect(Collectors.toSet());
    }

    @Override
    @Transactional
    public Set<ClassStatusResponse> findClassBySubject(SubjectDto dto) {
        Set<ClassStatusResponse> result = new HashSet<>();

        List<UserDto> userList = getUsersBySubject(dto);
        if (userList == null || userList.isEmpty()) {
            return result;
        }

        EducationalInstitutionDto institution = null;
        for (UserDto user : userList) {
            if (user.getRole().getRole().equals(UserRoleEnum.TEACHER.getDescription())) {
                institution = userEducationalInstitutionService.findEducationalInstitutionByUser(user);
                break;
            }
        }

        if (institution == null) {
            return result;
        }

        List<StudentClass> allInstitutionClasses = studentClassService.findClassByEducationalInstitution(institution);

        Set<Long> subscribedClassIds = new HashSet<>();
        for (UserDto user : userList) {
            List<StudentClass> userClasses = studentClassRepository.findByUserId(user.getId());
            if (userClasses != null) {
                for (StudentClass studentClass : userClasses) {
                    if (studentClass != null && studentClass.getId() != null) {
                        subscribedClassIds.add(studentClass.getId());
                    }
                }
            }
        }

        for (StudentClass studentClass : allInstitutionClasses) {
            boolean isSubscribed = subscribedClassIds.contains(studentClass.getId());
            result.add(new ClassStatusResponse(studentClassMapper.toDTO(studentClass), isSubscribed));
        }

        return result;
    }

    @Override
    @Transactional
    public void removeSubjectUserDto(SubjectClassRequest request) {
        try {
            Subject subject = subjectMapper.toEntity(request.getSubject());
            Long subjectId = subject.getId();

            if (subjectId == null) {
                throw new IllegalArgumentException("ID предмета не может быть null при удалении связи.");
            }

            for (StudentClassDto studentClassDto : request.getStudentClassDtoList()) {
                Set<User> users = getUsersByClass(studentClassMapper.toEntity(studentClassDto));

                for (User user : users) {
                    if (user.getRoles() != null &&
                            Objects.equals(user.getRoles().getRole(), UserRoleEnum.STUDENT.getDescription())) {

                        subjectUserRepositoryInterface.deleteBySubjectIdAndUserId(subjectId, user.getId());
                    }
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при удалении связи 'Пользователь_предмет': " + e.getMessage(), e);
        }
    }

    @Override
    public List<UserDto> getUsersBySubject(SubjectDto subject) {
        List<SubjectUser> subjectUsers = subjectUserRepositoryInterface.findBySubject(subjectMapper.toEntity(subject));
        List<UserDto> userDto = new ArrayList<>();
        for (SubjectUser  subjectUser  : subjectUsers) {
            userDto.add(userMapper.toDTO(subjectUser.getUser()));
        }
        return userDto;
    }

    @Override
    public Set<User> getUsersByClass(StudentClass studentClass) {
        Set<User> userList = new HashSet<>();
        for (UserClass userClass : userClassRepository.findByStudentClass(studentClass)) {
            if (userClass.getUser() != null) {
                userList.add(userClass.getUser());
            }
        }
        return userList;
    }
}
