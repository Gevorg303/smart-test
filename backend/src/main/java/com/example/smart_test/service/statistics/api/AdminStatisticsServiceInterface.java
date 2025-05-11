package com.example.smart_test.service.statistics.api;

import com.example.smart_test.dto.UserDto;
import com.example.smart_test.response.AdminStatisticsResponse;

import java.util.List;

public interface AdminStatisticsServiceInterface {
    List<AdminStatisticsResponse> countUser(UserDto user);
}
