package com.example.smart_test.service.api;

import com.example.smart_test.domain.Task;
import com.example.smart_test.domain.TaskResults;
import com.example.smart_test.domain.TestingAttempt;
import com.example.smart_test.dto.TestResultsDto;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TaskResultsServiceInterface {
    TaskResults addTaskResults(Task task, boolean status, TestingAttempt testingAttempt);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    void deleteTestResultsDto(TestResultsDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    List<TestResultsDto> getAllTestResults();

    List<TaskResults> findTaskResultsByTestingAttempt(TestingAttempt testingAttempt);
}
