package com.example.smart_test.enums;

import com.example.smart_test.domain.Role;
import lombok.Getter;

@Getter
public enum UserRoleEnum {
    ADMIN("Админ"),
    TEACHER("Учитель"),
    STUDENT("Ученик");

    private final String description;

    UserRoleEnum(String description) {
        this.description = description;
    }

    public Role convertToRole(UserRoleEnum userRoleEnum) {
        Role role = new Role();
        switch (userRoleEnum) {
            case ADMIN:
                role.setRole("Админ");
                break;
            case TEACHER:
                role.setRole("Учитель");
                break;
            case STUDENT:
                role.setRole("Ученик");
                break;
            default:
                throw new IllegalArgumentException("Unknown role: " + userRoleEnum);
        }
        return role;
    }
}
