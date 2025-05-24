package com.example.smart_test.service;


import com.example.smart_test.domain.TaskResults;
import com.example.smart_test.dto.TaskDto;
import com.example.smart_test.dto.TestResultsDto;
import com.example.smart_test.dto.TestingAttemptDto;
import com.example.smart_test.mapper.api.TaskMapperInterface;
import com.example.smart_test.mapper.api.TestResultsMapperInterface;
import com.example.smart_test.mapper.api.TestingAttemptMapperInterface;
import com.example.smart_test.repository.TaskResultsRepositoryInterface;
import com.example.smart_test.service.api.TaskResultsServiceInterface;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TaskResultsServiceImpl implements TaskResultsServiceInterface {

    @Autowired
    private TaskResultsRepositoryInterface taskResultsRepositoryInterface;
    @Autowired
    private TestResultsMapperInterface testResultsMapperInterface;
    @Autowired
    private TaskMapperInterface taskMapper;
    @Autowired
    private TestingAttemptMapperInterface testingAttemptMapper;

    @Override
    @Transactional
    public void addTaskResults(TaskDto task, int assessmentTask, TestingAttemptDto testingAttempt, boolean flag) {
        try {
            taskResultsRepositoryInterface.save(new TaskResults(taskMapper.toEntity(task), flag, testingAttemptMapper.toEntity(testingAttempt)));
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при создании сущности 'Результаты задания': " + e.getMessage(), e);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteTestResultsDto(TestResultsDto dto) {
        if (taskResultsRepositoryInterface.findById(dto.getId()).isPresent()) {
            TaskResults testResults = testResultsMapperInterface.toEntity(dto);
            taskResultsRepositoryInterface.delete(testResults);
        } else {
            log.error("Индикатор с идентификатором " + dto.getId() + " не существует");
        }
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<TestResultsDto> getAllTestResults() {
        try {
            List<TaskResults> testResultss = taskResultsRepositoryInterface.findAll();
            return testResultss.stream()
                    .map(testResultsMapperInterface::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при получении всех индикаторов: " + e.getMessage(), e);
        }
    }

    @Override
    public List<TaskResults> findTaskResultsByTestingAttempt(TestingAttemptDto testingAttempt) {
        return taskResultsRepositoryInterface.findByTestingAttemptAndResultOfTheIndicatorFalse(testingAttemptMapper.toEntity(testingAttempt));
    }

    @Override
    public void deleteByTestingAttemptId(TestingAttemptDto testingAttempt) {
        taskResultsRepositoryInterface.deleteByTestingAttemptId(testingAttempt.getId());
    }
}
