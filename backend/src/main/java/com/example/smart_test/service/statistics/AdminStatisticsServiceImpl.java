package com.example.smart_test.service.statistics;

import com.example.smart_test.dto.RoleDto;
import com.example.smart_test.dto.UserDto;
import com.example.smart_test.response.AdminStatisticsResponse;
import com.example.smart_test.service.api.UserServiceInterface;
import com.example.smart_test.service.statistics.api.AdminStatisticsServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminStatisticsServiceImpl extends BasicStatistics implements AdminStatisticsServiceInterface {
    @Autowired
    private UserServiceInterface userService;

    @Override
    public List<AdminStatisticsResponse> countUser(UserDto user) {
        List<AdminStatisticsResponse> list = new ArrayList<>();

        List<UserDto> adminDtoList = userService.getUser(user, new RoleDto(1L,"Админ"));
        if (adminDtoList != null) {
            list.add(new AdminStatisticsResponse(new RoleDto(2L,"Админ"), adminDtoList.size()));
        }

        List<UserDto> teacherDtoList = userService.getUser(user, new RoleDto(2L, "Учитель"));
        if (teacherDtoList != null) {
            list.add(new AdminStatisticsResponse(new RoleDto(2L,"Учитель"), teacherDtoList.size()));
        }

        List<UserDto> studentDtoList = userService.getUser(user, new RoleDto(3L,"Ученик"));
        if (studentDtoList != null) {
            list.add(new AdminStatisticsResponse(new RoleDto(3L,"Ученик"), studentDtoList.size()));
        }

        return list;
    }
}
