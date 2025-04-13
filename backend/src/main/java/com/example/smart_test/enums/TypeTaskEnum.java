package com.example.smart_test.enums;

import lombok.Getter;

@Getter
public enum TypeTaskEnum {
    MATCHING_TASK("Задание на сопоставление"),
    MULTIPLE_CHOICE("Задание на выбор ответа"),
    INPUT_ANSWER("Задание на ввод ответа");

    private final String description;

    TypeTaskEnum(String description) {
        this.description = description;
    }
}