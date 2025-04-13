package com.example.smart_test.response;

import com.example.smart_test.dto.ResponseOptionDto;
import com.example.smart_test.dto.TaskDto;
import lombok.Data;

import java.util.List;

@Data
public class ResponseForTask {
    private TaskDto task;
    private List<ResponseOptionDto> responseOption;

    public ResponseForTask(TaskDto task, List<ResponseOptionDto> responseOption) {
        this.task = task;
        this.responseOption = responseOption;
    }
}