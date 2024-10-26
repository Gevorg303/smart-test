package com.example.smart_test.dto;

import com.example.smart_test.domain.EducationalInstitution;
import com.example.smart_test.domain.User;
import lombok.Data;

@Data
public class TeacherEducationalInstitutionDto {
    private Long id;
    private User user;
    private EducationalInstitution educationalInstitution;
}
