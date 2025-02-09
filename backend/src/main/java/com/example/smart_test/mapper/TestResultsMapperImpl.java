package com.example.smart_test.mapper;

import com.example.smart_test.domain.TaskResults;
import com.example.smart_test.dto.TestResultsDto;
import com.example.smart_test.mapper.api.TestResultsMapperInterface;
import org.springframework.stereotype.Component;

@Component
public class TestResultsMapperImpl implements TestResultsMapperInterface {
    @Override
    public TestResultsDto toDto(TaskResults entity) {
        TestResultsDto dto = new TestResultsDto();
        dto.setId(entity.getId());
        dto.setTask(entity.getTask());
        dto.setResultOfTheIndicator(entity.isResultOfTheIndicator());
        return dto;
    }

    @Override
    public TaskResults toEntity(TestResultsDto dto) {
        TaskResults entity = new TaskResults();
        entity.setId(dto.getId());
        entity.setTask(dto.getTask());
        entity.setResultOfTheIndicator(dto.isResultOfTheIndicator());
        return entity;
    }
}
