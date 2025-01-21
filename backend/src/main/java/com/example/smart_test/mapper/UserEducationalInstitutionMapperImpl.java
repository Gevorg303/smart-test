package com.example.smart_test.mapper;

import com.example.smart_test.domain.UserEducationalInstitution;
import com.example.smart_test.dto.UserEducationalInstitutionDto;
import com.example.smart_test.mapper.api.UserEducationalInstitutionMapperInterface;
import org.springframework.stereotype.Component;

@Component
public class UserEducationalInstitutionMapperImpl implements UserEducationalInstitutionMapperInterface {
    @Override
    public UserEducationalInstitutionDto toDto(UserEducationalInstitution entity) {
        UserEducationalInstitutionDto dto = new UserEducationalInstitutionDto();
        dto.setId(entity.getId());
        dto.setUser(entity.getUser());
        dto.setEducationalInstitution(entity.getEducationalInstitution());
        return dto;
    }

    @Override
    public UserEducationalInstitution toEntity(UserEducationalInstitutionDto dto) {
        UserEducationalInstitution entity = new UserEducationalInstitution();
        entity.setId(dto.getId());
        entity.setUser(dto.getUser());
        entity.setEducationalInstitution(dto.getEducationalInstitution());
        return entity;
    }
}
