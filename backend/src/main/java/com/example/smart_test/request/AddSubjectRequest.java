package com.example.smart_test.request;

import com.example.smart_test.domain.Subject;
import com.example.smart_test.domain.User;
import lombok.Data;

@Data
public class AddSubjectRequest {
    private Subject subject;
    private User user;

    public AddSubjectRequest(Subject subject, User user) {
        this.subject = subject;
        this.user = user;
    }
}
