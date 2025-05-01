package com.example.smart_test.request;

import com.example.smart_test.dto.TaskDto;
import lombok.Data;

@Data
public class EditingTaskRequest {
    private TaskDto task;
    private boolean isDeleted;//флаг для удаления

    public EditingTaskRequest(TaskDto task, boolean isDeleted) {
        this.task = task;
        this.isDeleted = isDeleted;
    }
}
