package com.example.smart_test.request;

import com.example.smart_test.dto.SubjectDto;
import com.example.smart_test.dto.UserDto;
import lombok.Data;

@Data
public class TeacherStatisticsRequest {
    private UserDto user;
    private SubjectDto subject; // Предмет по которой нужна статистика

    public TeacherStatisticsRequest(UserDto user, SubjectDto subject) {
        this.user = user;
        this.subject = subject;
    }
}
