package com.example.smart_test.response;

import com.example.smart_test.dto.StudentClassDto;
import lombok.Data;


@Data
public class UserClassCountStatisticsResponse {
    private StudentClassDto studentClassDtoList;
    private int countStudentClass;

    public UserClassCountStatisticsResponse(StudentClassDto studentClassDtoList, int countStudentClass) {
        this.studentClassDtoList = studentClassDtoList;
        this.countStudentClass = countStudentClass;
    }
}
