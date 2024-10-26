package com.example.smart_test.mapper;

import com.example.smart_test.domain.Test;
import com.example.smart_test.dto.TestDto;
import com.example.smart_test.mapper.api.TestMapperInterface;
import org.springframework.stereotype.Component;

@Component
public class TestMapperImpl implements TestMapperInterface {
    @Override
    public TestDto toDto(Test entity) {
        TestDto dto = new TestDto();
        dto.setId(entity.getId());
        dto.setPassageTime(entity.getPassageTime());
        dto.setClosingDateAndTime(entity.getClosingDateAndTime());
        dto.setOpeningDateAndTime(entity.getOpeningDateAndTime());
        dto.setTheme(entity.getTheme());
        dto.setTypeTest(entity.getTypeTest());
        dto.setNumberOfAttemptsToPass(entity.getNumberOfAttemptsToPass());
        dto.setDescription(entity.getDescription());
        dto.setTestPassword(entity.getTestPassword());
        return dto;
    }

    @Override
    public Test toEntity(TestDto dto) {
        Test entity = new Test();
        entity.setId(dto.getId());
        entity.setPassageTime(dto.getPassageTime());
        entity.setClosingDateAndTime(dto.getClosingDateAndTime());
        entity.setOpeningDateAndTime(dto.getOpeningDateAndTime());
        entity.setTheme(dto.getTheme());
        entity.setTypeTest(dto.getTypeTest());
        entity.setNumberOfAttemptsToPass(dto.getNumberOfAttemptsToPass());
        entity.setDescription(dto.getDescription());
        entity.setTestPassword(dto.getTestPassword());
        return entity;
    }
}
