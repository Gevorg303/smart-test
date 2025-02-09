package com.example.smart_test.request;

import com.example.smart_test.domain.Task;
import lombok.Data;

@Data
public class RequestForTask {
    private Task task;
    private String response;
    private boolean status;

    public RequestForTask(Task task, String response, boolean status) {
        this.task = task;
        this.response = response;
        this.status = status;
    }
}
