package com.example.smart_test.request;

import com.example.smart_test.domain.Theme;
import com.example.smart_test.domain.User;
import com.example.smart_test.dto.TestDto;
import lombok.Data;

@Data
public class TestSimulatorRequest {
    private User user;
    private Theme theme;

    public TestSimulatorRequest(User user, Theme theme) {
        this.user = user;
        this.theme = theme;
    }
}
