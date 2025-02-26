package com.example.smart_test.request;

import com.example.smart_test.domain.*;
import lombok.Data;

@Data
public class TestFilterRequest {
    private TypeTest testType;
    private User user;
    private Subject subject;
    private Theme theme;

    public TestFilterRequest(TypeTest testType, User user, Subject subject, Theme theme) {
        this.testType = testType;
        this.user = user;
        this.subject = subject;
        this.theme = theme;
    }
}