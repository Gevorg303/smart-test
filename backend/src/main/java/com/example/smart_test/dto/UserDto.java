package com.example.smart_test.dto;

import com.example.smart_test.domain.Role;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

@Data
public class UserDto {
    private Long id;
    private String email;
    private String name;
    private String login;
    private String patronymic;
    private String passwordEncoder;
    private String surname;
    private Long roleId;
    private Role role;
    private String password;
    // private Set<Role> roles;
}
