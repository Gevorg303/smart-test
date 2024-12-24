package com.example.smart_test.service.api;

import com.example.smart_test.response.ResponseForTask;
import com.example.smart_test.dto.TestDto;

import java.util.List;

public interface ResponseVerificationServiceInterface {
    List<ResponseForTask> checkingResponse(List<ResponseForTask> responseForTaskList);
}
