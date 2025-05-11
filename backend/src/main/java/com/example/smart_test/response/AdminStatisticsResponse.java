package com.example.smart_test.response;

import com.example.smart_test.dto.RoleDto;
import lombok.Data;

@Data
public class AdminStatisticsResponse {
    private RoleDto role;
    private int count;

    public AdminStatisticsResponse(RoleDto role, int count) {
        this.role = role;
        this.count = count;
    }
}
