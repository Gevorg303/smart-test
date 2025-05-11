package com.example.smart_test.request;

import com.example.smart_test.dto.SubjectDto;
import com.example.smart_test.dto.UserDto;
import lombok.Data;

import java.util.List;

@Data
public class StudentStatisticsRequest {
    private List<SubjectDto> subject; //
    private UserDto user;

    public StudentStatisticsRequest(List<SubjectDto> subject, UserDto user) {
        this.subject = subject;
        this.user = user;
    }
}
