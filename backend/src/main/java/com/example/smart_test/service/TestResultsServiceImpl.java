package com.example.smart_test.service;


import com.example.smart_test.domain.TestResults;
import com.example.smart_test.dto.TestResultsDto;
import com.example.smart_test.mapper.api.TestResultsMapperInterface;
import com.example.smart_test.repository.TestResultsRepositoryInterface;
import com.example.smart_test.service.api.TestResultsServiceInterface;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TestResultsServiceImpl implements TestResultsServiceInterface {

    @Autowired
    private TestResultsRepositoryInterface testResultsRepositoryInterface;
    @Autowired
    private TestResultsMapperInterface testResultsMapperInterface;

    @Override
    public TestResultsDto addTestResultsDto(TestResultsDto dto) {
        try {
            TestResults testResults = testResultsMapperInterface.toEntity(dto);
            testResults = testResultsRepositoryInterface.save(testResults);
            return testResultsMapperInterface.toDto(testResults);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при добавлении индикатора: " + e.getMessage(), e);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteTestResultsDto(TestResultsDto dto) {
        if (testResultsRepositoryInterface.findById(dto.getId()).isPresent()) {
            TestResults testResults = testResultsMapperInterface.toEntity(dto);
            testResultsRepositoryInterface.delete(testResults);
        } else {
            log.error("Индикатор с идентификатором " + dto.getId() + " не существует");
        }
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<TestResultsDto> getAllTestResults() {
        try {
            List<TestResults> testResultss = testResultsRepositoryInterface.findAll();
            return testResultss.stream()
                    .map(testResultsMapperInterface::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при получении всех индикаторов: " + e.getMessage(), e);
        }
    }

}
