package com.example.smart_test.dto;

import com.example.smart_test.domain.Test;
import com.example.smart_test.domain.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalTime;

@Data
@NoArgsConstructor
public class TestingAttemptDto {
    private Long id;
    private Instant startDateTime;
    private LocalTime attemptDuration;
    private Test test;
    @JsonIgnore
    private User user;

    public TestingAttemptDto(Instant startDateTime, LocalTime attemptDuration, Test test, User user) {
        this.startDateTime = startDateTime;
        this.attemptDuration = attemptDuration;
        this.test = test;
        this.user = user;
    }

}
