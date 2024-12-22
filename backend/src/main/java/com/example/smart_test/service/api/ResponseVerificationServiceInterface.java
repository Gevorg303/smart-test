package com.example.smart_test.service.api;

import com.example.smart_test.dto.TaskDto;

public interface ResponseVerificationServiceInterface {
    boolean checkingResponse(TaskDto taskDto, String response);
}
