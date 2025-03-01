package com.example.smart_test.enums;

public enum UserRole {
    ADMIN(1L),
    TEACHER(2L),
    STUDENT(3L);

    private final Long id;

    UserRole(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}
