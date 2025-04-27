package com.example.smart_test.response;

import com.example.smart_test.dto.TestDto;
import lombok.Data;

import java.util.List;

@Data
public class ResponseForTest {
    private TestDto test; // Тест, который завершил пользователь
    private List<ResponseForTask> responseForTask; // Лист сущностей, каждая из которых содержит: задание, варианты ответа предоставленные пользователем (с указанием верное оно или нет), процент выполнения каждого задания
    private int testScore;// Процент прохождения теста

    public ResponseForTest(TestDto test, List<ResponseForTask> responseForTask, int testScore) {
        this.test = test;
        this.responseForTask = responseForTask;
        this.testScore = testScore;
    }
}
