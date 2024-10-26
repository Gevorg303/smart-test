package com.example.smart_test.mapper.api;

import com.example.smart_test.domain.EducationalInstitution;
import com.example.smart_test.dto.EducationalInstitutionDto;

public interface EducationalInstitutionMapperInterface {
    EducationalInstitutionDto toDTO(EducationalInstitution entity);

    EducationalInstitution toEntity(EducationalInstitutionDto dto);
}
