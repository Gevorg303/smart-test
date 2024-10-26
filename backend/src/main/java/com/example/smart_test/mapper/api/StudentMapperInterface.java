package com.example.smart_test.mapper.api;

import com.example.smart_test.domain.User;
import com.example.smart_test.dto.UserDto;

public interface StudentMapperInterface {
    UserDto toDTO(User entity);

    User toEntity(UserDto dto);
}
