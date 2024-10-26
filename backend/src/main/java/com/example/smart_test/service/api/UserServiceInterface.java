package com.example.smart_test.service.api;

import com.example.smart_test.domain.User;
import com.example.smart_test.dto.UserDto;
import jakarta.transaction.Transactional;

import java.util.List;

public interface UserServiceInterface {
    @Transactional
    UserDto addUser(UserDto userDto);

    @Transactional
    void deleteUser(UserDto userDto);

    @Transactional
    List<UserDto> getAllUsers();

    @Transactional
    UserDto getUserByLogin(UserDto userDto);

    User getUserByLogin(String login);
}
