package com.example.smart_test.service;


import com.example.smart_test.domain.SubjectTeacher;
import com.example.smart_test.dto.SubjectTeacherDto;
import com.example.smart_test.mapper.api.SubjectTeacherMapperInterface;
import com.example.smart_test.repository.SubjectTeacherRepositoryInterface;
import com.example.smart_test.service.api.SubjectTeacherServiceInterface;
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
public class SubjectTeacherServiceImpl implements SubjectTeacherServiceInterface {

    @Autowired
    private SubjectTeacherRepositoryInterface subjectTeacherRepositoryInterface;
    @Autowired
    private SubjectTeacherMapperInterface subjectTeacherMapperInterface;

    @Override
    public SubjectTeacherDto addSubjectTeacherDto(SubjectTeacherDto dto) {
        try {
            SubjectTeacher subjectTeacher = subjectTeacherMapperInterface.toEntity(dto);
            subjectTeacher = subjectTeacherRepositoryInterface.save(subjectTeacher);
            return subjectTeacherMapperInterface.toDto(subjectTeacher);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при добавлении индикатора: " + e.getMessage(), e);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteSubjectTeacherDto(SubjectTeacherDto dto) {
        if (findSubjectTeacherById(dto.getId())) {
            SubjectTeacher subjectTeacher = subjectTeacherMapperInterface.toEntity(dto);
            subjectTeacherRepositoryInterface.delete(subjectTeacher);
        } else {
            log.error("Индикатор с идентификатором " + dto.getId() + " не существует");
        }
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<SubjectTeacherDto> getAllSubjectTeachers() {
        try {
            List<SubjectTeacher> subjectTeachers = subjectTeacherRepositoryInterface.findAll();
            return subjectTeachers.stream()
                    .map(subjectTeacherMapperInterface::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при получении всех индикаторов: " + e.getMessage(), e);
        }
    }

    private boolean findSubjectTeacherById(Long id) {
        Optional<SubjectTeacher> subjectTeacher = subjectTeacherRepositoryInterface.findById(id);
        return subjectTeacher.isPresent();
    }
}
