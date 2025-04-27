package com.example.smart_test.request;

import com.example.smart_test.domain.Indicator;
import com.example.smart_test.domain.Subject;
import com.example.smart_test.domain.User;
import com.example.smart_test.dto.UserDto;
import lombok.Data;

@Data
public class IndicatorFilterRequest {
    private UserDto user;
    private Subject subject;

    public IndicatorFilterRequest(UserDto user, Subject subject) {
        this.user = user;
        this.subject = subject;
    }
}
