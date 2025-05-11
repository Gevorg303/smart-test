package com.example.smart_test.request;

import com.example.smart_test.dto.SubjectDto;
import com.example.smart_test.dto.UserDto;
import lombok.Data;

import java.util.List;

@Data
public class StudentStatisticsRequest {
    private List<SubjectDto> subject; // Лист предметов
    private UserDto user; //Текущий пользователь

    public StudentStatisticsRequest(List<SubjectDto> subject, UserDto user) {
        this.subject = subject;
        this.user = user;
    }
}
