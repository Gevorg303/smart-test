package com.example.smart_test.service.api;

import com.example.smart_test.domain.User;
import com.example.smart_test.dto.UserDto;
import com.example.smart_test.request.UserRequest;
import com.example.smart_test.response.UserResponse;
import jakarta.transaction.Transactional;

import java.util.List;

public interface UserServiceInterface {

    @Transactional
    List<UserResponse> addUser(List<UserRequest> userRequestList);

    @Transactional
    void deleteUser(UserDto userDto);

    @Transactional
    List<UserDto> getAllUsers();

    @Transactional
    UserDto getUserByLogin(User user);

    @Transactional
    User getUserByLogin(String login);
}
