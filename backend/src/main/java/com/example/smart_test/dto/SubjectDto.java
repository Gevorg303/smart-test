package com.example.smart_test.dto;

import com.example.smart_test.domain.TeacherClass;
import jakarta.persistence.Column;
import lombok.Data;

@Data
public class SubjectDto {
    private Long id;
    private String subjectName;
    private String description;
    private TeacherClass teacherClass;
}
