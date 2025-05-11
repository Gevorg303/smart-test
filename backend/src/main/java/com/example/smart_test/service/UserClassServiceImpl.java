package com.example.smart_test.service;


import com.example.smart_test.domain.StudentClass;
import com.example.smart_test.domain.User;
import com.example.smart_test.domain.UserClass;
import com.example.smart_test.dto.StudentClassDto;
import com.example.smart_test.dto.UserClassDto;
import com.example.smart_test.dto.UserDto;
import com.example.smart_test.enums.UserRoleEnum;
import com.example.smart_test.mapper.api.StudentClassMapperInterface;
import com.example.smart_test.mapper.api.UserClassMapperInterface;
import com.example.smart_test.mapper.api.UserMapperInterface;
import com.example.smart_test.repository.UserClassRepositoryInterface;
import com.example.smart_test.service.api.SubjectUserServiceInterface;
import com.example.smart_test.service.api.UserClassServiceInterface;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class UserClassServiceImpl implements UserClassServiceInterface {

    @Autowired
    private UserClassRepositoryInterface userClassRepositoryInterface;
    @Autowired
    private UserClassMapperInterface userClassMapperInterface;
    @Autowired
    private StudentClassMapperInterface studentClassMapperInterface;
    @Autowired
    private SubjectUserServiceInterface subjectUserService;
    @Autowired
    private UserMapperInterface userMapper;

    @Override
    @Transactional
    public UserClassDto addUserClass(UserClass userClass) {
        try {
            userClassRepositoryInterface.save(userClass);
            return userClassMapperInterface.toDto(userClass);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при добавлении индикатора: " + e.getMessage(), e);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteTeacherClassDto(UserClassDto dto) {
        if (findTeacherClassById(dto.getId())) {
            UserClass teacherClass = userClassMapperInterface.toEntity(dto);
            userClassRepositoryInterface.delete(teacherClass);
        } else {
            log.error("Индикатор с идентификатором " + dto.getId() + " не существует");
        }
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<UserClassDto> getAllTeacherClasses() {
        try {
            List<UserClass> teacherClasss = userClassRepositoryInterface.findAll();
            return teacherClasss.stream()
                    .map(userClassMapperInterface::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при получении всех индикаторов: " + e.getMessage(), e);
        }
    }

    @Override
    public UserClassDto getTeacherClassByClassAndTeacher(Long idClass, Long idTeacher) {
        try {
            UserClass subjects = userClassRepositoryInterface.findByClassAndTeacher(idClass, idTeacher);
            UserClassDto subjectDto = userClassMapperInterface.toDto(subjects);
            return subjectDto;
        } catch (Exception e) {
            throw new RuntimeException("Не удалось получить предмет: " + e.getMessage(), e);
        }

    }

    @Override
    public List<StudentClassDto> findStudentClassByUser(UserDto userDto) {
        List<UserClass> userClasses = userClassRepositoryInterface.findByUserId(userDto.getId());
        List<StudentClassDto> studentClassDtos = new ArrayList<>();

        for (UserClass userClass : userClasses) {
            StudentClass studentClass = userClass.getStudentClass();
            StudentClassDto dto = studentClassMapperInterface.toDTO(studentClass);
            studentClassDtos.add(dto);
        }

        return studentClassDtos;
    }

    private boolean findTeacherClassById(Long id) {
        Optional<UserClass> indicator = userClassRepositoryInterface.findById(id);
        return indicator.isPresent();
    }

    @Transactional
    @Override
    public List<User> getUsersByStudentClass(StudentClassDto request) {
        return userClassRepositoryInterface.findByStudentClassIdAndUserRoles(request.getId(), UserRoleEnum.STUDENT.convertToRole(UserRoleEnum.STUDENT))
                .stream()
                .map(UserClass::getUser)
                .collect(Collectors.toList());
    }

    @Override
    public Set<UserDto> getUserFilter(StudentClassDto request) {
        Set<UserDto> userDtoSet = new HashSet<>();
        for (User user : subjectUserService.getUsersByClass(studentClassMapperInterface.toEntity(request))) {
            userDtoSet.add(userMapper.toDTO(user));
        }
        return userDtoSet;
    }

    @Override
    public int countUsersByClassId(StudentClassDto request) {
        return userClassRepositoryInterface.countUsersByClassId(request.getId());
    }
}
