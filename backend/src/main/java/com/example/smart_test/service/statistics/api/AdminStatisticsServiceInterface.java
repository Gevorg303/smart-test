package com.example.smart_test.service.statistics.api;

import com.example.smart_test.dto.UserDto;
import com.example.smart_test.response.UserClassCountStatisticsResponse;
import com.example.smart_test.response.UserCountStatisticsResponse;

import java.util.List;

public interface AdminStatisticsServiceInterface {
    List<UserCountStatisticsResponse> countUser(UserDto user);

    List<UserClassCountStatisticsResponse> countStudentClass(UserDto user);
}
