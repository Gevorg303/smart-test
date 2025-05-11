package com.example.smart_test.response;

import com.example.smart_test.dto.SubjectDto;
import lombok.Data;

@Data
public class StudentStatisticsResponse {
    private SubjectDto subject; // Предмет
    private double score; // Средняя оценка по предмету

    public StudentStatisticsResponse(SubjectDto subject, double score) {
        this.subject = subject;
        this.score = score;
    }
}