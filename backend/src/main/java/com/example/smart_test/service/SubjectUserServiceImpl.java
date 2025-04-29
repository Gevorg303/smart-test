package com.example.smart_test.service;


import com.example.smart_test.domain.*;
import com.example.smart_test.dto.StudentClassDto;
import com.example.smart_test.dto.SubjectDto;
import com.example.smart_test.dto.SubjectUserDto;
import com.example.smart_test.dto.UserDto;
import com.example.smart_test.enums.UserRoleEnum;
import com.example.smart_test.mapper.api.StudentClassMapperInterface;
import com.example.smart_test.mapper.api.SubjectMapperInterface;
import com.example.smart_test.mapper.api.SubjectUserMapperInterface;
import com.example.smart_test.mapper.api.UserMapperInterface;
import com.example.smart_test.repository.StudentClassRepositoryInterface;
import com.example.smart_test.repository.SubjectUserRepositoryInterface;
import com.example.smart_test.repository.UserClassRepositoryInterface;
import com.example.smart_test.request.ClassStatusResponse;
import com.example.smart_test.request.SubjectClassRequest;
import com.example.smart_test.service.api.SubjectUserServiceInterface;
import com.example.smart_test.service.api.UserServiceInterface;
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
    private UserServiceInterface userService;
    @Autowired
    private UserMapperInterface userMapper;
    @Autowired
    private StudentClassRepositoryInterface studentClassRepository;

    @Override
    @Transactional
    public void addSubjectUserDto(SubjectClassRequest request) {
        try {
            Subject subject = subjectMapper.toEntity(request.getSubject());
            Set<Long> existingUserIds = getUsersBySubject(subject)
                    .stream()
                    .map(User::getId)
                    .collect(Collectors.toSet());

            for (StudentClassDto studentClassDto : request.getStudentClassDtoList()) {
                Set<User> users = getUsersByClass(studentClassMapper.toEntity(studentClassDto));

                for (User user : users) {
                    if (!existingUserIds.contains(user.getId())) {
                        subjectUserRepositoryInterface.save(new SubjectUser(subject, user));
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
        List<User> userList = getUsersBySubject(subjectMapper.toEntity(dto));
        Set<ClassStatusResponse> studentClassDtoSet = new HashSet<>();
        if (userList != null) {
            for (User user : userList) {
                List<StudentClassDto> studentClassDtoList = userService.findStudentClassByUser(userMapper.toDTO(user));
                for (StudentClassDto studentClassDto : studentClassDtoList) {
                    for (StudentClass studentClass1 : studentClassRepository.findByUserId(user.getId())) {
                        if (Objects.equals(studentClassDto.getId(), studentClass1.getId())) {
                            studentClassDtoSet.add(new ClassStatusResponse(studentClassMapper.toDTO(studentClass1), true));
                        } else {
                            studentClassDtoSet.add(new ClassStatusResponse(studentClassDto, false));
                        }
                    }
                }

            }
        }
        return studentClassDtoSet;
    }

    @Override
    @Transactional
    public void removeSubjectUserDto(SubjectClassRequest request) {
        try {
            Subject subject = subjectMapper.toEntity(request.getSubject());

            for (StudentClassDto studentClassDto : request.getStudentClassDtoList()) {
                Set<User> users = getUsersByClass(studentClassMapper.toEntity(studentClassDto));

                for (User user : users) {
                    if (Objects.equals(user.getRoles().getRole(), UserRoleEnum.STUDENT.getDescription())) {
                        subjectUserRepositoryInterface.deleteBySubjectIdAndUserId(subject.getId(), user.getId());
                    }
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при удалении связи 'Пользователь_предмет': " + e.getMessage(), e);
        }
    }


    private List<User> getUsersBySubject(Subject subject) {
        return subjectUserRepositoryInterface.findBySubject(subject)
                .stream()
                .map(SubjectUser::getUser)
                .collect(Collectors.toList());
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
