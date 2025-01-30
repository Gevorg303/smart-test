package com.example.smart_test.request;

import com.example.smart_test.domain.Task;
import com.example.smart_test.dto.TestDto;
import lombok.Data;

import java.util.List;

@Data
public class TestRequest {
    private TestDto test;
    private List<Task> taskList;

    public TestRequest(TestDto test, List<Task> taskList) {
        this.test = test;
        this.taskList = taskList;
    }
}
