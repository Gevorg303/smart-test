package com.example.smart_test.mapper.api;

import com.example.smart_test.domain.Test;
import com.example.smart_test.dto.TestDto;

public interface TestMapperInterface {
    TestDto toDto(Test entity);

    Test toEntity(TestDto dto);
}
