package com.example.smart_test.enums;

import lombok.Getter;

@Getter
public enum TypeTestEnum {
    ENTRY_TEST(1L),   // Входной контроль
    TRAINER(2L),      // Тренажер
    FINAL_TEST(3L);   // Итоговый тест

    private final Long id;

    TypeTestEnum(Long id) {
        this.id = id;
    }
}
