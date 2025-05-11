package com.example.smart_test.response;

import com.example.smart_test.dto.SubjectDto;
import lombok.Data;

@Data
public class AssessmentForSubjectResponse {
    private SubjectDto subject;
    private double score;

    public AssessmentForSubjectResponse(SubjectDto subject, double score) {
        this.subject = subject;
        this.score = score;
    }
}
