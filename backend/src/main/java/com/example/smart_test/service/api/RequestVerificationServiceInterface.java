package com.example.smart_test.service.api;

import com.example.smart_test.request.RequestForTask;
import com.example.smart_test.response.ResponseForTask;

import java.util.List;

public interface RequestVerificationServiceInterface {
    List<ResponseForTask> checkingResponse(List<RequestForTask> RequestForTaskList);
}
