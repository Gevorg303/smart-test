package com.example.smart_test.mapper;

import com.example.smart_test.domain.UserClass;
import com.example.smart_test.dto.UserClassDto;
import com.example.smart_test.mapper.api.UserClassMapperInterface;
import org.springframework.stereotype.Component;

@Component
public class UserClassMapperImpl implements UserClassMapperInterface {
    @Override
    public UserClassDto toDto(UserClass entity) {
        UserClassDto dto = new UserClassDto();
        dto.setId(entity.getId());
        dto.setUser(entity.getUser());
        dto.setStudentClass(entity.getStudentClass());
        return dto;
    }

    @Override
    public UserClass toEntity(UserClassDto dto) {
        UserClass entity = new UserClass();
        entity.setId(dto.getId());
        entity.setUser(dto.getUser());
        entity.setStudentClass(dto.getStudentClass());
        return entity;
    }
}
