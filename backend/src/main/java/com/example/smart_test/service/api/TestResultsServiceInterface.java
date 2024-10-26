package com.example.smart_test.service.api;

import com.example.smart_test.dto.TestResultsDto;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TestResultsServiceInterface {
    public TestResultsDto addTestResultsDto(TestResultsDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteTestResultsDto(TestResultsDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<TestResultsDto> getAllTestResults();
}
