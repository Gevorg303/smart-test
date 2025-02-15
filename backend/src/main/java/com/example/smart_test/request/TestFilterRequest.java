package com.example.smart_test.request;

import com.example.smart_test.domain.Subject;
import com.example.smart_test.domain.TypeTest;
import com.example.smart_test.domain.User;
import lombok.Data;

@Data
public class TestFilterRequest {
    private TypeTest testType;
    private User user;
    private Subject subject;

    public TestFilterRequest(TypeTest testType, User user, Subject subject) {
        this.testType = testType;
        this.user = user;
        this.subject = subject;
    }
}