package com.example.smart_test.request;

import com.example.smart_test.dto.EducationalInstitutionDto;
import com.example.smart_test.dto.StudentClassDto;
import com.example.smart_test.dto.UserDto;
import lombok.Data;

@Data
public class UserRequest {
    private UserDto user;
    private EducationalInstitutionDto educationalInstitution;
    private StudentClassDto studentClass;
}
