package com.example.smart_test.mapper.api;

import com.example.smart_test.domain.TeacherEducationalInstitution;
import com.example.smart_test.dto.TeacherEducationalInstitutionDto;

public interface TeacherEducationalInstitutionMapperInterface {
    public TeacherEducationalInstitutionDto toDto(TeacherEducationalInstitution entity);

    public TeacherEducationalInstitution toEntity(TeacherEducationalInstitutionDto dto);
}
