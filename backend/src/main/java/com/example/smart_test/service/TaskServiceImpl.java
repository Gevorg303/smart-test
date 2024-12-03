package com.example.smart_test.service;


import com.example.smart_test.domain.Task;
import com.example.smart_test.domain.Test;
import com.example.smart_test.dto.TaskDto;
import com.example.smart_test.dto.TestDto;
import com.example.smart_test.mapper.api.TaskMapperInterface;
import com.example.smart_test.mapper.api.TestMapperInterface;
import com.example.smart_test.repository.TaskRepositoryInterface;
import com.example.smart_test.service.api.TaskServiceInterface;
import lombok.extern.slf4j.Slf4j;
import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TaskServiceImpl implements TaskServiceInterface {
    @Autowired
    private TaskRepositoryInterface taskRepositoryInterface;
    @Autowired
    private TaskMapperInterface taskMapperInterface;
    @Autowired
    private TestMapperInterface testMapperInterface;
    @Autowired
    private TestServiceImpl testServiceImpl;

    @Override
    public TaskDto addTaskDto(TaskDto dto) {
        try {
            Task task = taskMapperInterface.toEntity(dto);
            task = taskRepositoryInterface.save(task);
            return taskMapperInterface.toDto(task);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при создании задачи: " + e.getMessage(), e);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteTaskDto(TaskDto dto) {
        if (findTaskById(dto.getId())) {
            Task task = taskMapperInterface.toEntity(dto);
            taskRepositoryInterface.delete(task);
        } else {
            log.error("Задача с идентификатором " + dto.getId() + " не существует");
        }
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<TaskDto> getAllTasks() {
        try {
            List<Task> tasks = taskRepositoryInterface.findAll();
            return getDtoList(tasks);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при получении всех тестов: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<TaskDto> findTasksTheTest(TestDto dto) {
        try {
            List<Task> tasks = taskRepositoryInterface.findAll();
            List<Task> tasksTheTestList = new ArrayList<>();
            for (Task task : tasks) {
                if (task.getTest() == null) {
                    continue;
                }
                if (Objects.equals(task.getTest().getId(), dto.getId())) {
                    tasksTheTestList.add(task);
                }
            }
            Assert.assertFalse(tasksTheTestList.isEmpty());
            return getDtoList(tasksTheTestList);
        } catch (Exception e) {
            log.error("У данного теста нет заданий: {}", e.getMessage(), e);
        }
        return null;
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<TaskDto> displayTheAvailableTasks(TestDto dto) {
        List<Task> tasks = taskRepositoryInterface.findTasksByTestId(dto.getId());
        return getDtoList(tasks);
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void addTaskToTest(Long testId, Long taskId) {
        try {
            Test test = testMapperInterface.toEntity(testServiceImpl.getTestById(testId));
            Task task = taskMapperInterface.toEntity(getTaskById(taskId));
            task.setTest(test);
            taskRepositoryInterface.save(task);
        } catch (Exception e) {
            log.error(
                    "Не удалость добавить задание:" + taskId +
                    " в тест: " + testId +
                    "Причина: " + e.getMessage(), e);
        }
    }

    @Override
    public void removeTaskFromTest(Long taskId) {
        try {
            Task task = taskMapperInterface.toEntity(getTaskById(taskId));
            task.setTest(null);
            taskRepositoryInterface.save(task);
        } catch (Exception e) {
            log.error(
                    "Не удалость удалить задание из теста: e.getMessage(), e)"
            );
        }
    }

    public void addTaskTheTest() {

    }

    private List<TaskDto> getDtoList(List<Task> taskList) {
        return taskList.stream()
                .map(taskMapperInterface::toDto)
                .collect(Collectors.toList());
    }

//    @Override
//    @Transactional(propagation = Propagation.REQUIRES_NEW)
//    public List<TaskDto> getFindTask() {
//        try {
//            List<Task> tasks = taskRepositoryInterface.findTasks();
//            return tasks.stream()
//                    .map(taskMapperInterface::toDto)
//                    .collect(Collectors.toList());
//        } catch (Exception e) {
//            throw new RuntimeException("Ошибка при получении доступных задач для теста: " + e.getMessage());
//        }
//    }

    private boolean findTaskById(Long id) {
        Optional<Task> task = taskRepositoryInterface.findById(id);
        return task.isPresent();
    }

    @Override
    public TaskDto getTaskById(Long id) {
        try {
            Task task = taskRepositoryInterface.findById(id)
                    .orElseThrow(() -> new RuntimeException("Задание не найдено"));
            return taskMapperInterface.toDto(task);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при получении задания: " + e.getMessage(), e);
        }
    }
}
