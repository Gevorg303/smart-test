package com.example.smart_test.request;

import com.example.smart_test.dto.SubjectDto;
import com.example.smart_test.dto.UserDto;
import lombok.Data;

import java.util.List;

@Data
public class TeacherStatisticsResponse {
    private SubjectDto subject;// Предмет
    private List<UserDto> excellentStudents;// Список отличников
    private List<UserDto> goodStudents;// Список хорошистов
    private List<UserDto> averageStudents;// Список троечников
    private List<UserDto> poorStudents;// Список двоечников

    public TeacherStatisticsResponse(SubjectDto subject, List<UserDto> excellentStudents, List<UserDto> goodStudents, List<UserDto> averageStudents, List<UserDto> poorStudents) {
        this.subject = subject;
        this.excellentStudents = excellentStudents;
        this.goodStudents = goodStudents;
        this.averageStudents = averageStudents;
        this.poorStudents = poorStudents;
    }
}

