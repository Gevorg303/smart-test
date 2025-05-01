package com.example.smart_test.service.api;


import com.example.smart_test.domain.Indicator;
import com.example.smart_test.domain.ResponseOption;
import com.example.smart_test.domain.Task;
import com.example.smart_test.domain.User;
import com.example.smart_test.dto.TaskDto;
import com.example.smart_test.dto.TestDto;
import com.example.smart_test.dto.ThemeDto;
import com.example.smart_test.dto.UserDto;
import com.example.smart_test.request.EditingTaskRequest;
import com.example.smart_test.request.RequestForTask;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

public interface TaskServiceInterface {
    @Transactional
    TaskDto addTask(Task task, List<ResponseOption> responseOption, List<Indicator> indicator);

    @Transactional
    void deleteTask(Task task);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    List<TaskDto> getAllTasks();

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    List<TaskDto> findTasksTheTest(TestDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    Set<TaskDto> displayTheAvailableTasks(ThemeDto theme);

    List<TaskDto> getUserTasks(UserDto user);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    void addTaskToTest(Long testId, Long taskId);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    Task getTaskById(Long id);

    @Transactional
    void removeTaskFromTest(TaskDto taskDto);

    void updateTask(EditingTaskRequest updatedTask);
}
