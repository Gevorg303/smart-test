package com.example.smart_test.service.api;


import com.example.smart_test.dto.TaskDto;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TaskServiceInterface {
    public TaskDto addTaskDto(TaskDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteTaskDto(TaskDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<TaskDto> getAllTasks();

    //List<TaskDto> getFindTask();
}
