package com.example.smart_test.response;

import com.example.smart_test.dto.ResponseOptionDto;
import com.example.smart_test.dto.TaskDto;
import com.example.smart_test.dto.TestDto;
import lombok.Data;

import java.util.List;

@Data
public class ResponseForTask {
    private TaskDto task; // Задание
    private List<ResponseOptionDto> responseOption; // Варианты ответа которые дал пользователь с указанием верно оно или нет
    private int taskScore; // Процент прохождения задания

    public ResponseForTask(TaskDto task, List<ResponseOptionDto> responseOption, int taskScore) {
        this.task = task;
        this.responseOption = responseOption;
        this.taskScore = taskScore;
    }
}