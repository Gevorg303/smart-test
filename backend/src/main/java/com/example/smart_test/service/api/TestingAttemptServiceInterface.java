package com.example.smart_test.service.api;

import com.example.smart_test.domain.Test;
import com.example.smart_test.domain.TestingAttempt;
import com.example.smart_test.domain.User;
import com.example.smart_test.dto.TestDto;

public interface TestingAttemptServiceInterface {
    TestingAttempt addTestingAttempt(TestingAttempt testingAttempt);

    TestingAttempt findTestingAttemptByTest(User user, TestDto test);
}
