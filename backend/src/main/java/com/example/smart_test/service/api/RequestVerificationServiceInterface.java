package com.example.smart_test.service.api;

import com.example.smart_test.request.RequestForTask;

import java.util.List;

public interface RequestVerificationServiceInterface {
    List<RequestForTask> checkingResponse(List<RequestForTask> RequestForTaskList);
}
