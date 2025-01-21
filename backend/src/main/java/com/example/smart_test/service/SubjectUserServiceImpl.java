package com.example.smart_test.service;


import com.example.smart_test.domain.SubjectUser;
import com.example.smart_test.dto.SubjectUserDto;
import com.example.smart_test.mapper.api.SubjectUserMapperInterface;
import com.example.smart_test.repository.SubjectUserRepositoryInterface;
import com.example.smart_test.service.api.SubjectUserServiceInterface;
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
public class SubjectUserServiceImpl implements SubjectUserServiceInterface {

    @Autowired
    private SubjectUserRepositoryInterface subjectUserRepositoryInterface;
    @Autowired
    private SubjectUserMapperInterface subjectUserMapperInterface;

    @Override
    public SubjectUserDto addSubjectTeacherDto(SubjectUserDto dto) {
        try {
            SubjectUser subjectTeacher = subjectUserMapperInterface.toEntity(dto);
            subjectTeacher = subjectUserRepositoryInterface.save(subjectTeacher);
            return subjectUserMapperInterface.toDto(subjectTeacher);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при добавлении индикатора: " + e.getMessage(), e);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteSubjectTeacherDto(SubjectUserDto dto) {
        if (findSubjectTeacherById(dto.getId())) {
            SubjectUser subjectTeacher = subjectUserMapperInterface.toEntity(dto);
            subjectUserRepositoryInterface.delete(subjectTeacher);
        } else {
            log.error("Индикатор с идентификатором " + dto.getId() + " не существует");
        }
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
            throw new RuntimeException("Ошибка при получении всех индикаторов: " + e.getMessage(), e);
        }
    }

    private boolean findSubjectTeacherById(Long id) {
        Optional<SubjectUser> subjectTeacher = subjectUserRepositoryInterface.findById(id);
        return subjectTeacher.isPresent();
    }
}
