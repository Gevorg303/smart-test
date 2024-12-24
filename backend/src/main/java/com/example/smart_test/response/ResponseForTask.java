package com.example.smart_test.response;

import com.example.smart_test.dto.TaskDto;
import lombok.Data;

@Data
public class ResponseForTask {
    private TaskDto task;
    private String response;
    private boolean status;

    public ResponseForTask(TaskDto task, String response, boolean status) {
        this.task = task;
        this.response = response;
        this.status = status;
    }
}
