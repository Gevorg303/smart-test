package com.example.smart_test.request;

import com.example.smart_test.dto.TaskDto;
import lombok.Data;

import java.util.List;

@Data
public class EditingTaskRequest {
    private TaskDto task;
    private boolean isDeleted;//флаг для удаления задания (заполнять только при редактировании ТЕСТА!!!)
    private List<EditingResponseOptionRequest> editingResponseOption; //заполнять только при редактировании ЗАДАНИЯ, не ТЕСТА!!!

    public EditingTaskRequest(TaskDto task, boolean isDeleted, List<EditingResponseOptionRequest> editingResponseOption) {
        this.task = task;
        this.isDeleted = isDeleted;
        this.editingResponseOption = editingResponseOption;
    }
}
