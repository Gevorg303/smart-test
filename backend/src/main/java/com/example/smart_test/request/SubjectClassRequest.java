package com.example.smart_test.request;

import com.example.smart_test.dto.StudentClassDto;
import com.example.smart_test.dto.SubjectDto;
import lombok.Data;

@Data
public class SubjectClassRequest {
    private SubjectDto subject;
    private StudentClassDto studentClass;

    public SubjectClassRequest(SubjectDto subject, StudentClassDto studentClass) {
        this.subject = subject;
        this.studentClass = studentClass;
    }
}
