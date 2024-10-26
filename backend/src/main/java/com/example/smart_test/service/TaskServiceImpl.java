package com.example.smart_test.service;


import com.example.smart_test.domain.Task;
import com.example.smart_test.dto.TaskDto;
import com.example.smart_test.mapper.api.TaskMapperInterface;
import com.example.smart_test.repository.TaskRepositoryInterface;
import com.example.smart_test.service.api.TaskServiceInterface;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TaskServiceImpl implements TaskServiceInterface {
    @Autowired
    private TaskRepositoryInterface taskRepositoryInterface;
    @Autowired
    private TaskMapperInterface taskMapperInterface;

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
            return tasks.stream()
                    .map(taskMapperInterface::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при получении всех тестов: " + e.getMessage(), e);
        }
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
}
