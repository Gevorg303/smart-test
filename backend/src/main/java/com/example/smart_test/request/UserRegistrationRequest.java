package com.example.smart_test.request;

import com.example.smart_test.dto.UserDto;
import lombok.Data;

import java.util.List;

@Data
public class UserRegistrationRequest {
    private UserDto user;
    private List<UserRequest> userRequestList;

    public UserRegistrationRequest(UserDto user, List<UserRequest> userRequestList) {
        this.user = user;
        this.userRequestList = userRequestList;
    }
}
