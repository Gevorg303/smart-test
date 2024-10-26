package com.example.smart_test.dto;

import com.example.smart_test.domain.Subject;
import jakarta.persistence.Column;
import lombok.Data;

@Data
public class ThemeDto {
    private Long id;
    private Subject subject;
    private String themeName;
}
