package com.example.smart_test.service.statistics;

import com.example.smart_test.dto.SubjectDto;
import com.example.smart_test.request.StudentStatisticsRequest;
import com.example.smart_test.response.StudentStatisticsResponse;
import com.example.smart_test.service.api.SubjectServiceInterface;
import com.example.smart_test.service.statistics.api.StudentStatisticsServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class StudentStatisticsServiceImpl extends BasicStatistics implements StudentStatisticsServiceInterface {
    @Autowired
    private SubjectServiceInterface subjectService;

    public List<StudentStatisticsResponse> getStudentStatistics(StudentStatisticsRequest request) {
        List<StudentStatisticsResponse> studentStatisticsResponseList = new ArrayList<>();
        if (request.getSubject() != null) {
            for (SubjectDto subject : request.getSubject()) {
                double score = calculateFinalGrade(subject, request.getUser());
                studentStatisticsResponseList.add(new StudentStatisticsResponse(subject, score));
            }
        }
        return studentStatisticsResponseList;
    }
}
