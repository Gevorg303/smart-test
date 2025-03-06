package com.example.smart_test.mapper.api;

import com.example.smart_test.domain.UserClass;
import com.example.smart_test.dto.UserClassDto;

public interface UserClassMapperInterface {
    UserClassDto toDto(UserClass entity);

    UserClass toEntity(UserClassDto dto);

}
