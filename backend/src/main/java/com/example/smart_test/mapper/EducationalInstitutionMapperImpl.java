package com.example.smart_test.mapper;

import com.example.smart_test.domain.EducationalInstitution;
import com.example.smart_test.dto.EducationalInstitutionDto;
import com.example.smart_test.mapper.api.EducationalInstitutionMapperInterface;
import org.springframework.stereotype.Component;

@Component
public class EducationalInstitutionMapperImpl implements EducationalInstitutionMapperInterface {
    @Override
    public EducationalInstitutionDto toDTO(EducationalInstitution entity) {
        EducationalInstitutionDto dto = new EducationalInstitutionDto();
        dto.setId(entity.getId());
        dto.setAddress(entity.getAddress());
        dto.setNameOfTheInstitution(entity.getNameOfTheInstitution());
        return dto;
    }

    @Override
    public EducationalInstitution toEntity(EducationalInstitutionDto dto) {
        EducationalInstitution entity = new EducationalInstitution();
        entity.setId(dto.getId());
        entity.setAddress(dto.getAddress());
        entity.setNameOfTheInstitution(dto.getNameOfTheInstitution());
        return entity;
    }

}
