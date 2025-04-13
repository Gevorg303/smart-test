package com.example.smart_test.dto;

import com.example.smart_test.domain.Test;
import com.example.smart_test.domain.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.time.Instant;
import java.time.LocalTime;

@Data
public class TestingAttemptDto {
    private Long id;
    private Instant startDateTime;
    private LocalTime attemptDuration;
    private Test test;
    @JsonIgnore
    private User user;
    private int testResult;
}
