package com.example.smart_test.service.statistics.api;

import com.example.smart_test.dto.UserDto;
import com.example.smart_test.response.StudentStatisticsResponse;

import java.util.List;

public interface StudentStatisticsServiceInterface {
    List<StudentStatisticsResponse> getStudentStatistics(UserDto userDto);
}
