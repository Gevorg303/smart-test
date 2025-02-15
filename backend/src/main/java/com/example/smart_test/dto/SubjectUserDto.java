package com.example.smart_test.dto;

import com.example.smart_test.domain.Subject;
import com.example.smart_test.domain.User;
import lombok.Data;

@Data
public class SubjectUserDto {
    private Long id;
    private Subject subject;
    private User user;
}
