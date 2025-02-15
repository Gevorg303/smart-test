package com.example.smart_test.request;

import com.example.smart_test.domain.Indicator;
import com.example.smart_test.domain.Subject;
import com.example.smart_test.domain.User;
import lombok.Data;

@Data
public class IndicatorFilterRequest {
    private User user;
    private Subject subject;

    public IndicatorFilterRequest(User user, Subject subject) {
        this.user = user;
        this.subject = subject;
    }
}
