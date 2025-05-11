package com.example.smart_test.service.statistics;

import com.example.smart_test.dto.SubjectDto;
import com.example.smart_test.dto.UserDto;
import com.example.smart_test.response.StudentStatisticsResponse;
import com.example.smart_test.service.api.SubjectServiceInterface;
import com.example.smart_test.service.statistics.api.StudentStatisticsServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class StudentStatisticsServiceImpl extends BasicStatistics implements StudentStatisticsServiceInterface {
    @Autowired
    private SubjectServiceInterface subjectService;
    @Autowired
    private SubjectServiceInterface studentService;

    @Override
    public List<StudentStatisticsResponse> getStudentStatistics(UserDto userDto) {
        List<StudentStatisticsResponse> studentStatisticsResponseList = new ArrayList<>();
        Set<SubjectDto> subjectDtoList = studentService.getSubjectByUser(userDto);
        for (SubjectDto subject : subjectDtoList) {
            double score = calculateFinalGrade(subject, userDto);
            studentStatisticsResponseList.add(new StudentStatisticsResponse(subject, score));
        }
        return studentStatisticsResponseList;
    }
}
