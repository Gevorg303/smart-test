package com.example.smart_test.enums;

import lombok.Getter;

@Getter
public enum TypeTestEnum {
    ENTRY_TEST("Входной контроль"),
    TRAINER("Тренажер"),
    FINAL_TEST("Итоговый тест");

    private final String description;

    TypeTestEnum(String description) {
        this.description = description;
    }
}
