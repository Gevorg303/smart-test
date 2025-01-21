package com.example.smart_test.mapper.api;

import com.example.smart_test.domain.UserEducationalInstitution;
import com.example.smart_test.dto.UserEducationalInstitutionDto;

public interface UserEducationalInstitutionMapperInterface {
    UserEducationalInstitutionDto toDto(UserEducationalInstitution entity);

    UserEducationalInstitution toEntity(UserEducationalInstitutionDto dto);
}
