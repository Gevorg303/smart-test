package com.example.smart_test.service.api;

import com.example.smart_test.dto.UserDto;

public interface AuthServiceInterface {
    public UserDto checkUser(UserDto dto);
}
