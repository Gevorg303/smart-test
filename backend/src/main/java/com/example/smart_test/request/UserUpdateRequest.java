package com.example.smart_test.request;

import com.example.smart_test.domain.Role;
import com.example.smart_test.dto.RoleDto;
import com.example.smart_test.dto.StudentClassDto;
import com.example.smart_test.dto.UserDto;
import lombok.Data;

@Data
public class UserUpdateRequest {
    private UserDto user; // пользователь
    private Role role; // роль
    private StudentClassDto studentClass; // класс

    public UserUpdateRequest(UserDto user, Role role, StudentClassDto studentClass) {
        this.user = user;
        this.role = role;
        this.studentClass = studentClass;
    }
}
