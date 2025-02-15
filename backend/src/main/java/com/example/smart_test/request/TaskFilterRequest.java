package com.example.smart_test.request;

import com.example.smart_test.domain.Indicator;
import com.example.smart_test.domain.Subject;
import com.example.smart_test.domain.Theme;
import com.example.smart_test.domain.User;
import lombok.Data;

@Data
public class TaskFilterRequest {
    private User user;
    private Subject subject;
    private Theme theme;
    private Indicator indicator;

    public TaskFilterRequest(User user, Subject subject, Theme theme, Indicator indicator) {
        this.user = user;
        this.subject = subject;
        this.theme = theme;
        this.indicator = indicator;
    }
}
