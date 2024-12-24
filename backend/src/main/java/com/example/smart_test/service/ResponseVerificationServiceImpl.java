package com.example.smart_test.service;

import com.example.smart_test.response.ResponseForTask;
import com.example.smart_test.dto.ResponseOptionDto;
import com.example.smart_test.dto.TaskDto;
import com.example.smart_test.dto.TestDto;
import com.example.smart_test.service.api.ResponseOptionServiceInterface;
import com.example.smart_test.service.api.ResponseVerificationServiceInterface;
import com.example.smart_test.service.api.TaskServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ResponseVerificationServiceImpl implements ResponseVerificationServiceInterface {
    @Autowired
    private ResponseOptionServiceInterface responseOptionServiceInterface;
    @Autowired
    private TaskServiceInterface taskServiceInterface;

    private int countCorrectTasks = 0;

    @Override
    public List<ResponseForTask> checkingResponse(List<ResponseForTask> responseForTaskList) {
        List<ResponseOptionDto> responseOptionDtoList = responseOptionServiceInterface.getAllResponseOptions();

        Map<Long, TaskDto> taskCache = responseForTaskList.stream()
                .map(ResponseForTask::getTask)
                .map(task -> taskServiceInterface.getTaskById(task.getId()))
                .filter(Objects::nonNull)
                .collect(Collectors.toMap(TaskDto::getId, dto -> dto));

        return responseForTaskList.stream()
                .map(responseForTask -> {
                    TaskDto taskDto = taskCache.get(responseForTask.getTask().getId());
                    boolean isCorrect = taskDto != null && responseOptionDtoList.stream().anyMatch(option ->
                            Objects.equals(taskDto.getId(), option.getTask().getId()) &&
                                    Objects.equals(option.getQuestion(), responseForTask.getResponse())
                    );

                    return new ResponseForTask(
                            taskDto,
                            responseForTask.getResponse(),
                            isCorrect
                    );
                })
                .collect(Collectors.toList());
    }

    @Override
    public double calculateTestResult(TestDto testDto){
        int countTasksTest = 0;
        for (TaskDto taskDto : taskServiceInterface.getAllTasks()) {
            if (testDto.getId().equals(taskDto.getTest().getId())) {
                countTasksTest++;
            }
        }
        double percentage = (double) countCorrectTasks / countTasksTest * 100;
        countCorrectTasks = 0;
        return percentage;
    }
}
