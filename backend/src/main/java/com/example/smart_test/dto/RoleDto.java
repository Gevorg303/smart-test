package com.example.smart_test.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RoleDto {
    private Long id;
    private String role;

    public RoleDto(Long id, String role) {
        this.id = id;
        this.role = role;
    }
}
