package com.example.smart_test.enums;

import lombok.Getter;

@Getter
public enum UserRoleEnum {
    ADMIN(1L),
    TEACHER(2L),
    STUDENT(3L);

    private final Long id;

    UserRoleEnum(Long id) {
        this.id = id;
    }
}
