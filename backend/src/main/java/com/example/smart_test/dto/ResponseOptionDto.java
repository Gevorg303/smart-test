package com.example.smart_test.dto;

import com.example.smart_test.domain.Task;
import lombok.Data;

@Data
public class ResponseOptionDto {
    private Long id;
    private String question;
    private String response;
    private boolean validResponse;
    private Task task;
}
