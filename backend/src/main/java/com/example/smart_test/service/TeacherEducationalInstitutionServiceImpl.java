package com.example.smart_test.service;


import com.example.smart_test.domain.TeacherEducationalInstitution;
import com.example.smart_test.dto.TeacherEducationalInstitutionDto;
import com.example.smart_test.mapper.api.TeacherEducationalInstitutionMapperInterface;
import com.example.smart_test.repository.TeacherEducationalInstitutionRepositoryInterface;
import com.example.smart_test.service.api.TeacherEducationalInstitutionServiceInterface;
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
public class TeacherEducationalInstitutionServiceImpl implements TeacherEducationalInstitutionServiceInterface {

    @Autowired
    private TeacherEducationalInstitutionRepositoryInterface teacherEducationalInstitutionRepositoryInterface;
    @Autowired
    private TeacherEducationalInstitutionMapperInterface teacherEducationalInstitutionMapperInterface;

    @Override
    public TeacherEducationalInstitutionDto addTeacherEducationalInstitutionDto(TeacherEducationalInstitutionDto dto) {
        try {
            TeacherEducationalInstitution teacherEducationalInstitution = teacherEducationalInstitutionMapperInterface.toEntity(dto);
            teacherEducationalInstitution = teacherEducationalInstitutionRepositoryInterface.save(teacherEducationalInstitution);
            return teacherEducationalInstitutionMapperInterface.toDto(teacherEducationalInstitution);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при добавлении индикатора: " + e.getMessage(), e);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteTeacherEducationalInstitutionDto(TeacherEducationalInstitutionDto dto) {
        if (findTeacherEducationalInstitutionById(dto.getId())) {
            TeacherEducationalInstitution teacherEducationalInstitution = teacherEducationalInstitutionMapperInterface.toEntity(dto);
            teacherEducationalInstitutionRepositoryInterface.delete(teacherEducationalInstitution);
        } else {
            log.error("Индикатор с идентификатором " + dto.getId() + " не существует");
        }
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<TeacherEducationalInstitutionDto> getAllTeacherEducationalInstitutions() {
        try {
            List<TeacherEducationalInstitution> teacherEducationalInstitutions = teacherEducationalInstitutionRepositoryInterface.findAll();
            return teacherEducationalInstitutions.stream()
                    .map(teacherEducationalInstitutionMapperInterface::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при получении всех индикаторов: " + e.getMessage(), e);
        }
    }

    private boolean findTeacherEducationalInstitutionById(Long id) {
        Optional<TeacherEducationalInstitution> teacherEducationalInstitution = teacherEducationalInstitutionRepositoryInterface.findById(id);
        return teacherEducationalInstitution.isPresent();
    }
}
