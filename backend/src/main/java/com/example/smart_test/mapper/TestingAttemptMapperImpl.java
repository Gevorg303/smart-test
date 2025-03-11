package com.example.smart_test.mapper;

import com.example.smart_test.domain.TestingAttempt;
import com.example.smart_test.dto.TestingAttemptDto;
import com.example.smart_test.mapper.api.TestingAttemptMapperInterface;
import org.springframework.stereotype.Component;

@Component
public class TestingAttemptMapperImpl implements TestingAttemptMapperInterface {
    @Override
    public TestingAttemptDto toDto(TestingAttempt entity) {
        TestingAttemptDto dto = new TestingAttemptDto();
        dto.setId(entity.getId());
        dto.setTest(entity.getTest());
        dto.setUser(entity.getUser());
        dto.setAttemptDuration(entity.getAttemptDuration());
        dto.setStartDateTime(entity.getStartDateTime());
        return dto;
    }

    @Override
    public TestingAttempt toEntity(TestingAttemptDto dto) {
        TestingAttempt entity = new TestingAttempt();
        entity.setId(dto.getId());
        entity.setTest(dto.getTest());
        entity.setUser(dto.getUser());
        entity.setAttemptDuration(dto.getAttemptDuration());
        entity.setStartDateTime(dto.getStartDateTime());
        return entity;
    }
}
