package com.example.smart_test.mapper.api;

import com.example.smart_test.domain.TestingAttempt;
import com.example.smart_test.dto.TestingAttemptDto;

public interface TestingAttemptMapperInterface {
    TestingAttemptDto toDto(TestingAttempt entity);

    TestingAttempt toEntity(TestingAttemptDto dto);
}
