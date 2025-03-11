package com.example.smart_test.request;

import com.example.smart_test.domain.User;
import com.example.smart_test.dto.TestDto;
import lombok.Data;

@Data
public class TestingAttemptAndTest {
    private User user;
    private TestDto test;

    public TestingAttemptAndTest(User user, TestDto test) {
        this.user = user;
        this.test = test;
    }
}
