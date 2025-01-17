package com.example.smart_test.mapper;

import com.example.smart_test.domain.TestResults;
import com.example.smart_test.dto.TestResultsDto;
import com.example.smart_test.mapper.api.TestResultsMapperInterface;
import org.springframework.stereotype.Component;

@Component
public class TestResultsMapperImpl implements TestResultsMapperInterface {
    @Override
    public TestResultsDto toDto(TestResults entity) {
        TestResultsDto dto = new TestResultsDto();
        dto.setId(entity.getId());
        dto.setTask(entity.getTask());
        dto.setResultOfTheIndicator(entity.isResultOfTheIndicator());
        return dto;
    }

    @Override
    public TestResults toEntity(TestResultsDto dto) {
        TestResults entity = new TestResults();
        entity.setId(dto.getId());
        entity.setTask(dto.getTask());
        entity.setResultOfTheIndicator(dto.isResultOfTheIndicator());
        return entity;
    }
}
