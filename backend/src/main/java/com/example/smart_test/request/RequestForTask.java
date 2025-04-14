package com.example.smart_test.request;

import com.example.smart_test.domain.Task;
import com.example.smart_test.dto.ResponseOptionDto;
import com.example.smart_test.dto.TaskDto;
import lombok.Data;

import java.util.List;

@Data
public class RequestForTask {
    private TaskDto task; //Задание
    private List<ResponseOptionDto> responseOption; //Лист вариантов ответов которые предоставил пользователь

    public RequestForTask(TaskDto task, List<ResponseOptionDto> responseOption) {
        this.task = task;
        this.responseOption = responseOption;
    }
}
