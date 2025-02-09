package com.example.smart_test.mapper.api;

import com.example.smart_test.domain.TaskResults;
import com.example.smart_test.dto.TestResultsDto;

public interface TestResultsMapperInterface {
    public TestResultsDto toDto(TaskResults entity);

    public TaskResults toEntity(TestResultsDto dto);
}
