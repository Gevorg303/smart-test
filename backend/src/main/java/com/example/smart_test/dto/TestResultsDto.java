package com.example.smart_test.dto;

import com.example.smart_test.domain.Indicator;
import com.example.smart_test.domain.Task;
import com.example.smart_test.domain.Test;
import com.example.smart_test.domain.User;
import lombok.Data;

@Data
public class TestResultsDto {
    private Long id;
    private Task task;
    private Indicator indicator;
    private Test test;
    private User user;
    private boolean resultOfTheIndicator;
}
