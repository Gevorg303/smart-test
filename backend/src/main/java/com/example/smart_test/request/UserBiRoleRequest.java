package com.example.smart_test.request;

import com.example.smart_test.dto.RoleDto;
import com.example.smart_test.dto.UserDto;
import lombok.Data;

@Data
public class UserBiRoleRequest {
    private UserDto userDto;
    private RoleDto roleDto;

    public UserBiRoleRequest(UserDto userDto, RoleDto roleDto) {
        this.userDto = userDto;
        this.roleDto = roleDto;
    }
}
