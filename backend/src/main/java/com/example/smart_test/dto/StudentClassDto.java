package com.example.smart_test.dto;

import com.example.smart_test.domain.EducationalInstitution;
import lombok.Data;

@Data
public class StudentClassDto {
    private Long id;
    private String letterDesignation;
    private EducationalInstitution educationalInstitution;
    private String numberOfInstitution;
}
