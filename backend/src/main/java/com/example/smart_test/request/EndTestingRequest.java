package com.example.smart_test.request;

import com.example.smart_test.domain.Test;
import com.example.smart_test.domain.User;
import lombok.Data;

import java.time.Instant;
import java.time.LocalTime;
import java.util.List;

@Data
public class EndTestingRequest {
    private Instant startDateTime;
    private LocalTime attemptDuration;
    private Test test;
    private User user;
    private List<RequestForTask> requestForTaskList;

    public EndTestingRequest(Instant startDateTime, LocalTime attemptDuration, Test test, User user, List<RequestForTask> requestForTaskList) {
        this.startDateTime = startDateTime;
        this.attemptDuration = attemptDuration;
        this.test = test;
        this.user = user;
        this.requestForTaskList = requestForTaskList;
    }
}
