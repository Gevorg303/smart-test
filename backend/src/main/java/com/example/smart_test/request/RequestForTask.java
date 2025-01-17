package com.example.smart_test.request;

import com.example.smart_test.dto.TaskDto;
import lombok.Data;

@Data
public class RequestForTask {
    private TaskDto task;
    private String response;
    private boolean status;

    public RequestForTask(TaskDto task, String response, boolean status) {
        this.task = task;
        this.response = response;
        this.status = status;
    }
}
