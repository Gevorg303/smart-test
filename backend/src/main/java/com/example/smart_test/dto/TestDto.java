package com.example.smart_test.dto;

import com.example.smart_test.domain.Theme;
import com.example.smart_test.domain.TypeTest;

import java.time.LocalDateTime;
import java.time.LocalTime;

import com.example.smart_test.domain.User;
import lombok.Data;

@Data
public class TestDto {
    private Long id;
    private LocalTime passageTime;
    private LocalDateTime closingDateAndTime;
    private LocalDateTime openingDateAndTime;
    private Theme theme;
    private TypeTest typeTest;
    private int numberOfAttemptsToPass;
    private String description;
    private String testPassword;
}
