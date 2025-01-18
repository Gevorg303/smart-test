package com.example.smart_test.request;

import com.example.smart_test.domain.Indicator;
import com.example.smart_test.domain.ResponseOption;
import com.example.smart_test.domain.Task;
import lombok.Data;

import java.util.List;

@Data
public class AddTaskRequest {
    private Task task;
    private List<ResponseOption> responseOption;
    private Indicator indicator;

    public AddTaskRequest(Task task, List<ResponseOption> responseOption, Indicator indicator) {
        this.task = task;
        this.responseOption = responseOption;
        this.indicator = indicator;
    }
}
