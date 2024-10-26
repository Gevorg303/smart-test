package com.example.smart_test.dto;

import jakarta.persistence.Column;
import lombok.Data;

@Data
public class TypeTestDto {
    private Long id;
    private String nameOfTestType;
}
