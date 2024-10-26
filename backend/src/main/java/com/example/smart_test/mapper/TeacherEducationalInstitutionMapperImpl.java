package com.example.smart_test.mapper;

import com.example.smart_test.domain.TeacherEducationalInstitution;
import com.example.smart_test.dto.TeacherEducationalInstitutionDto;
import com.example.smart_test.mapper.api.TeacherEducationalInstitutionMapperInterface;
import org.springframework.stereotype.Component;

@Component
public class TeacherEducationalInstitutionMapperImpl implements TeacherEducationalInstitutionMapperInterface {
    @Override
    public TeacherEducationalInstitutionDto toDto(TeacherEducationalInstitution entity) {
        TeacherEducationalInstitutionDto dto = new TeacherEducationalInstitutionDto();
        dto.setId(entity.getId());
        dto.setUser(entity.getUser());
        dto.setEducationalInstitution(entity.getEducationalInstitution());
        return dto;
    }

    @Override
    public TeacherEducationalInstitution toEntity(TeacherEducationalInstitutionDto dto) {
        TeacherEducationalInstitution entity = new TeacherEducationalInstitution();
        entity.setId(dto.getId());
        entity.setUser(dto.getUser());
        entity.setEducationalInstitution(dto.getEducationalInstitution());
        return entity;
    }
}
