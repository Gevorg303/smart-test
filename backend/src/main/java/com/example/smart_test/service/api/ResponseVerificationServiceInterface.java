package com.example.smart_test.service.api;

import com.example.smart_test.dto.TaskDto;
import com.example.smart_test.dto.TestDto;

public interface ResponseVerificationServiceInterface {
    boolean checkingResponse(TaskDto taskDto, String response);

    String calculateTestResult(TestDto testDto);
}
