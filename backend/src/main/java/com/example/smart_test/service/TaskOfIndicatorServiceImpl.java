package com.example.smart_test.service;


import com.example.smart_test.domain.Indicator;
import com.example.smart_test.domain.Task;
import com.example.smart_test.domain.TaskOfIndicator;
import com.example.smart_test.dto.TaskOfIndicatorDto;
import com.example.smart_test.mapper.api.TaskOfIndicatorMapperInterface;
import com.example.smart_test.repository.TaskOfIndicatorRepositoryInterface;
import com.example.smart_test.service.api.TaskOfIndicatorServiceInterface;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TaskOfIndicatorServiceImpl implements TaskOfIndicatorServiceInterface {

    @Autowired
    private TaskOfIndicatorRepositoryInterface taskOfIndicatorRepositoryInterface;
    @Autowired
    private TaskOfIndicatorMapperInterface taskOfIndicatorMapperInterface;

    @Override
    @Transactional
    public void addTaskOfIndicator(Task task, Indicator indicator) {
        try {
            TaskOfIndicator taskOfIndicator = taskOfIndicatorRepositoryInterface.save(new TaskOfIndicator(task, indicator));
            taskOfIndicatorMapperInterface.toDto(taskOfIndicator);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при добавлении связи задание с индикатором: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public void deleteTaskOfIndicator(TaskOfIndicator taskOfIndicator) {
        if (findTaskOfIndicatorById(taskOfIndicator.getId())) {
            taskOfIndicatorRepositoryInterface.delete(taskOfIndicator);
        } else {
            log.error("Связь задание с индикатором " + taskOfIndicator.getId() + " не найден");
        }
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<TaskOfIndicatorDto> getAllTaskOfIndicators() {
        try {
            List<TaskOfIndicator> taskOfIndicators = taskOfIndicatorRepositoryInterface.findAll();
            return taskOfIndicators.stream()
                    .map(taskOfIndicatorMapperInterface::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при получении всех связей Задание с индикатором: " + e.getMessage(), e);
        }
    }

    private boolean findTaskOfIndicatorById(Long id) {
        Optional<TaskOfIndicator> taskOfIndicator = taskOfIndicatorRepositoryInterface.findById(id);
        return taskOfIndicator.isPresent();
    }

    @Override
    @Transactional
    public List<TaskOfIndicator> findTaskOfIndicatorByIdTask(Task task) {
        List<TaskOfIndicator> taskOfIndicatorList = new ArrayList<>();
        for (TaskOfIndicator taskOfIndicator : taskOfIndicatorRepositoryInterface.findAll()) {
            if (taskOfIndicator.getTask().getId().equals(task.getId())) {
                taskOfIndicatorList.add(taskOfIndicator);
            }
        }
        return taskOfIndicatorList;
    }

    @Transactional
    @Override
    public List<TaskOfIndicator> findTaskOfIndicatorByIdIndicator(Indicator indicator){
        return taskOfIndicatorRepositoryInterface.findByIndicatorId(indicator.getId());
    }

    @Override
    public List<TaskOfIndicator> findTaskOfIndicatorByTask(Task task) {
        return taskOfIndicatorRepositoryInterface.findByTask(task);
    }

    @Override
    public List<TaskOfIndicator> findTaskOfIndicatorByIndicator(Indicator indicator) {
        return taskOfIndicatorRepositoryInterface.findByIndicator(indicator);
    }
}
