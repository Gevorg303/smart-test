package com.example.smart_test.domain;

import com.example.smart_test.enums.UserRole;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "роль")
@Data
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "идентификатор_роли")
    private Long id;
    @Column(name = "название_роли")
    private String role;

    public UserRole getRoleType() {
        return UserRole.values()[(int) (id - 1)];
    }
}
