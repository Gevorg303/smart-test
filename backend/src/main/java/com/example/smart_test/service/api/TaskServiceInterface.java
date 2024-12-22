package com.example.smart_test.service.api;


import com.example.smart_test.dto.TaskDto;
import com.example.smart_test.dto.TestDto;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Set;

public interface TaskServiceInterface {
    TaskDto addTaskDto(TaskDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    void deleteTaskDto(TaskDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    List<TaskDto> getAllTasks();

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    List<TaskDto> findTasksTheTest(TestDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    Set<TaskDto> displayTheAvailableTasks(TestDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    void addTaskToTest(Long testId, Long taskId);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    TaskDto getTaskById(Long id);

    void removeTaskFromTest(Long taskId);
}
