package com.example.smart_test.service.statistics.api;

import com.example.smart_test.dto.SubjectDto;
import com.example.smart_test.dto.UserDto;
import com.example.smart_test.request.TeacherStatisticsResponse;

import java.util.List;

public interface TeacherStatisticsServiceInterface {
    List<TeacherStatisticsResponse> getTeacherStatistics(UserDto user, SubjectDto subject);
}
