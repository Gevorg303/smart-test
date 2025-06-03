package com.example.smart_test.response;

import com.example.smart_test.dto.StudentClassDto;
import lombok.Data;

@Data
public class ClassStatusResponse {
    private StudentClassDto studentClassDto;
    private boolean status;

    public ClassStatusResponse(StudentClassDto studentClassDto, boolean status) {
        this.studentClassDto = studentClassDto;
        this.status = status;
    }
}
