package com.example.smart_test.response;

import com.example.smart_test.dto.ResponseOptionDto;
import com.example.smart_test.dto.TaskDto;
import com.example.smart_test.dto.TestDto;
import lombok.Data;

import java.util.List;

@Data
public class ResponseForTask {
    private TaskDto task;
    private List<ResponseOptionDto> responseOption;
    private TestDto test;

    public ResponseForTask(TaskDto task, List<ResponseOptionDto> responseOption, TestDto test) {
        this.task = task;
        this.responseOption = responseOption;
        this.test = test;
    }
}