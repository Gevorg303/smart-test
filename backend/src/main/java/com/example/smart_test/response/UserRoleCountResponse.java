package com.example.smart_test.response;

import com.example.smart_test.dto.RoleDto;
import lombok.Data;

@Data
public class UserRoleCountResponse {
    private RoleDto role;
    private int count;

    public UserRoleCountResponse(RoleDto role, int count) {
        this.role = role;
        this.count = count;
    }
}
