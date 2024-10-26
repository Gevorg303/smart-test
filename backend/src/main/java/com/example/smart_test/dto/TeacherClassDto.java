package com.example.smart_test.dto;

import com.example.smart_test.domain.StudentClass;
import com.example.smart_test.domain.User;
import lombok.Data;

@Data
public class TeacherClassDto {
    private Long id;
    private StudentClass studentClass;
    private User user;
}
