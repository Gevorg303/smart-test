package com.example.smart_test.service.statistics;

import com.example.smart_test.dto.RoleDto;
import com.example.smart_test.dto.UserDto;
import com.example.smart_test.enums.UserRoleEnum;
import com.example.smart_test.request.UserBiRoleRequest;
import com.example.smart_test.response.UserRoleCountResponse;
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

    public List<UserRoleCountResponse> countUser(UserDto user) {
        List<UserRoleCountResponse> list = new ArrayList<>();
        List<UserDto> userDtoList = userService.getUser(user, new RoleDto("Админ"));
        if (userDtoList != null) {
            list.add(new UserRoleCountResponse(new RoleDto("Admin"), userDtoList.size()));
        }
        return list;
    }
}
