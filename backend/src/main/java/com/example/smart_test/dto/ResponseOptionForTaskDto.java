package com.example.smart_test.dto;

import com.example.smart_test.domain.ResponseOption;
import com.example.smart_test.domain.Task;
import lombok.Data;

@Data
public class ResponseOptionForTaskDto {
    private Long id;
    private Task task;
    private ResponseOption responseOption;
}