package com.example.smart_test.dto;

import com.example.smart_test.domain.UserClass;
import lombok.Data;

@Data
public class SubjectDto {
    private Long id;
    private String subjectName;
    private String description;
    private UserClass teacherClass;
}
