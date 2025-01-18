package com.example.smart_test.service;

import com.example.smart_test.domain.ResponseOptionForTask;
import com.example.smart_test.request.RequestForTask;
import com.example.smart_test.dto.ResponseOptionDto;
import com.example.smart_test.dto.TaskDto;
import com.example.smart_test.service.api.RequestVerificationServiceInterface;
import com.example.smart_test.service.api.ResponseOptionForTaskServiceInterface;
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
    @Autowired
    private ResponseOptionForTaskServiceInterface responseOptionForTaskService;

    @Override
    public List<RequestForTask> checkingResponse(List<RequestForTask> requestForTaskList) {
        List<ResponseOptionForTask> responseOptionForTaskList = responseOptionForTaskService.getAllResponseOptionsForTask();

        Map<Long, TaskDto> taskCache = requestForTaskList.stream()
                .map(RequestForTask::getTask)
                .map(task -> taskServiceInterface.getTaskById(task.getId()))
                .filter(Objects::nonNull)
                .collect(Collectors.toMap(TaskDto::getId, dto -> dto));

        return requestForTaskList.stream()
                .map(requestForTask -> {
                    TaskDto taskDto = taskCache.get(requestForTask.getTask().getId());
                    boolean isCorrect = taskDto != null && responseOptionForTaskList.stream().anyMatch(option ->
                            Objects.equals(taskDto.getId(), option.getTask().getId()) &&
                                    Objects.equals(option.getResponseOption().getResponse(), requestForTask.getResponse())
                    );

                    return new RequestForTask(
                            taskDto,
                            requestForTask.getResponse(),
                            isCorrect
                    );
                })
                .collect(Collectors.toList());
    }

}
