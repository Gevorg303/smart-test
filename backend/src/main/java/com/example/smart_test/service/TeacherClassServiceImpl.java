package com.example.smart_test.service;


import com.example.smart_test.domain.TeacherClass;
import com.example.smart_test.domain.Theme;
import com.example.smart_test.dto.TeacherClassDto;
import com.example.smart_test.dto.ThemeDto;
import com.example.smart_test.mapper.api.TeacherClassMapperInterface;
import com.example.smart_test.repository.TeacherClassRepositoryInterface;
import com.example.smart_test.service.api.TeacherClassServiceInterface;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TeacherClassServiceImpl implements TeacherClassServiceInterface {

    @Autowired
    private TeacherClassRepositoryInterface teacherClassRepositoryInterface;
    @Autowired
    private TeacherClassMapperInterface teacherClassMapperInterface;

    @Override
    public TeacherClassDto addTeacherClassDto(TeacherClassDto dto) {
        try {
            TeacherClass teacherClass = teacherClassMapperInterface.toEntity(dto);
            teacherClass = teacherClassRepositoryInterface.save(teacherClass);
            return teacherClassMapperInterface.toDto(teacherClass);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при добавлении индикатора: " + e.getMessage(), e);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteTeacherClassDto(TeacherClassDto dto) {
        if (findTeacherClassById(dto.getId())) {
            TeacherClass teacherClass = teacherClassMapperInterface.toEntity(dto);
            teacherClassRepositoryInterface.delete(teacherClass);
        } else {
            log.error("Индикатор с идентификатором " + dto.getId() + " не существует");
        }
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<TeacherClassDto> getAllTeacherClasses() {
        try {
            List<TeacherClass> teacherClasss = teacherClassRepositoryInterface.findAll();
            return teacherClasss.stream()
                    .map(teacherClassMapperInterface::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при получении всех индикаторов: " + e.getMessage(), e);
        }
    }

    @Override
    public TeacherClassDto getTeacherClassByClassAndTeacher(Long idClass, Long idTeacher) {
        try {
            TeacherClass subjects = teacherClassRepositoryInterface.findByClassAndTeacher(idClass, idTeacher);
            TeacherClassDto subjectDto = teacherClassMapperInterface.toDto(subjects);
            return subjectDto;
        } catch (Exception e) {
            throw new RuntimeException("Не удалось получить предмет: " + e.getMessage(), e);
        }

    }


    private boolean findTeacherClassById(Long id) {
        Optional<TeacherClass> indicator = teacherClassRepositoryInterface.findById(id);
        return indicator.isPresent();
    }
}
