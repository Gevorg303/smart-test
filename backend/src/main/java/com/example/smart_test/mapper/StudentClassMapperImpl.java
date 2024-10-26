package com.example.smart_test.mapper;

import com.example.smart_test.domain.StudentClass;
import com.example.smart_test.dto.StudentClassDto;
import com.example.smart_test.mapper.api.StudentClassMapperInterface;
import org.springframework.stereotype.Component;

@Component
public class StudentClassMapperImpl implements StudentClassMapperInterface {
    @Override
    public StudentClassDto toDTO(StudentClass entity) {
        StudentClassDto dto = new StudentClassDto();
        dto.setId(entity.getId());
        dto.setLetterDesignation(entity.getLetterDesignation());
        dto.setEducationalInstitution(entity.getEducationalInstitution());
        dto.setNumberOfInstitution(entity.getNumberOfInstitution());
        return dto;
    }

    @Override
    public StudentClass toEntity(StudentClassDto dto) {
        StudentClass entity = new StudentClass();
        entity.setId(dto.getId());
        entity.setLetterDesignation(dto.getLetterDesignation());
        entity.setEducationalInstitution(dto.getEducationalInstitution());
        entity.setNumberOfInstitution(dto.getNumberOfInstitution());
        return entity;
    }
}
