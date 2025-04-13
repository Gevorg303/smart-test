package com.example.smart_test.response;

import com.example.smart_test.dto.TestDto;
import com.example.smart_test.dto.TestingAttemptDto;
import lombok.Data;

import java.util.List;

@Data
public class ResponseForTest {
    private TestDto test;
    private List<ResponseForTask> responseForTask;
    private TestingAttemptDto testingAttemptDto;

    public ResponseForTest(TestDto test, List<ResponseForTask> responseForTask, TestingAttemptDto testingAttemptDto) {
        this.test = test;
        this.responseForTask = responseForTask;
        this.testingAttemptDto = testingAttemptDto;
    }
}
