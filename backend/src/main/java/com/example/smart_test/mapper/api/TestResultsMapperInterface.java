package com.example.smart_test.mapper.api;

import com.example.smart_test.domain.TestResults;
import com.example.smart_test.dto.TestResultsDto;

public interface TestResultsMapperInterface {
    public TestResultsDto toDto(TestResults entity);

    public TestResults toEntity(TestResultsDto dto);
}
