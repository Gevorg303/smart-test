package com.example.smart_test.request;

import com.example.smart_test.dto.StudentClassDto;
import com.example.smart_test.dto.SubjectDto;
import lombok.Data;

import java.util.List;

@Data
public class SubjectClassRequest {
    private SubjectDto subject;
    private List<StudentClassDto> studentClassDtoList;

    public SubjectClassRequest(SubjectDto subject, List<StudentClassDto> studentClassDtoList) {
        this.subject = subject;
        this.studentClassDtoList = studentClassDtoList;
    }
}
