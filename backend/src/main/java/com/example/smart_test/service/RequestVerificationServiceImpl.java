package com.example.smart_test.service;

import com.example.smart_test.request.RequestForTask;
import com.example.smart_test.dto.ResponseOptionDto;
import com.example.smart_test.dto.TaskDto;
import com.example.smart_test.service.api.RequestVerificationServiceInterface;
import com.example.smart_test.service.api.ResponseOptionServiceInterface;
import com.example.smart_test.service.api.TaskServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RequestVerificationServiceImpl implements RequestVerificationServiceInterface {
    @Autowired
    private ResponseOptionServiceInterface responseOptionServiceInterface;
    @Autowired
    private TaskServiceInterface taskServiceInterface;

    @Override
    public List<RequestForTask> checkingResponse(List<RequestForTask> RequestForTaskList) {
        List<ResponseOptionDto> responseOptionDtoList = responseOptionServiceInterface.getAllResponseOptions();

        Map<Long, TaskDto> taskCache = RequestForTaskList.stream()
                .map(RequestForTask::getTask)
                .map(task -> taskServiceInterface.getTaskById(task.getId()))
                .filter(Objects::nonNull)
                .collect(Collectors.toMap(TaskDto::getId, dto -> dto));

        return RequestForTaskList.stream()
                .map(RequestForTask -> {
                    TaskDto taskDto = taskCache.get(RequestForTask.getTask().getId());
                    boolean isCorrect = taskDto != null && responseOptionDtoList.stream().anyMatch(option ->
                            Objects.equals(taskDto.getId(), option.getTask().getId()) &&
                                    Objects.equals(option.getResponse(), RequestForTask.getResponse())
                    );

                    return new RequestForTask(
                            taskDto,
                            RequestForTask.getResponse(),
                            isCorrect
                    );
                })
                .collect(Collectors.toList());
    }
}
