package com.example.smart_test.service;


import com.example.smart_test.domain.UserClass;
import com.example.smart_test.dto.UserClassDto;
import com.example.smart_test.mapper.api.TeacherClassMapperInterface;
import com.example.smart_test.repository.UserClassRepositoryInterface;
import com.example.smart_test.service.api.UserClassServiceInterface;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class UserClassServiceImpl implements UserClassServiceInterface {

    @Autowired
    private UserClassRepositoryInterface userClassRepositoryInterface;
    @Autowired
    private TeacherClassMapperInterface userClassMapperInterface;

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

    private boolean findTeacherClassById(Long id) {
        Optional<UserClass> indicator = userClassRepositoryInterface.findById(id);
        return indicator.isPresent();
    }
}
