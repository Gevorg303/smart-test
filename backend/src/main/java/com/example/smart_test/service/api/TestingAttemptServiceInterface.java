package com.example.smart_test.service.api;

import com.example.smart_test.domain.Test;
import com.example.smart_test.domain.TestingAttempt;
import com.example.smart_test.domain.User;
import com.example.smart_test.dto.TestDto;
import com.example.smart_test.dto.TestingAttemptDto;

import java.util.List;

public interface TestingAttemptServiceInterface {
    TestingAttempt addTestingAttempt(TestingAttempt testingAttempt);

    TestingAttempt findTopByUserAndTest_IdOrderByStartDateTimeDesc(User user, TestDto test);

    List<TestingAttempt> findTestingAttemptByTest(User user, Test test);
}
