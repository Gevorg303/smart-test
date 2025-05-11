package com.example.smart_test.service.statistics;

import com.example.smart_test.dto.RoleDto;
import com.example.smart_test.dto.StudentClassDto;
import com.example.smart_test.dto.UserDto;
import com.example.smart_test.response.UserClassCountStatisticsResponse;
import com.example.smart_test.response.UserCountStatisticsResponse;
import com.example.smart_test.service.api.UserClassServiceInterface;
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
    @Autowired
    private UserClassServiceInterface userClassService;

    @Override
    public List<UserCountStatisticsResponse> countUser(UserDto user) {
        List<UserCountStatisticsResponse> list = new ArrayList<>();

        List<UserDto> adminDtoList = userService.getUser(user, new RoleDto(1L,"Админ"));
        if (adminDtoList != null) {
            list.add(new UserCountStatisticsResponse(new RoleDto(2L,"Админ"), adminDtoList.size()));
        }

        List<UserDto> teacherDtoList = userService.getUser(user, new RoleDto(2L, "Учитель"));
        if (teacherDtoList != null) {
            list.add(new UserCountStatisticsResponse(new RoleDto(2L,"Учитель"), teacherDtoList.size()));
        }

        List<UserDto> studentDtoList = userService.getUser(user, new RoleDto(3L,"Ученик"));
        if (studentDtoList != null) {
            list.add(new UserCountStatisticsResponse(new RoleDto(3L,"Ученик"), studentDtoList.size()));
        }

        return list;
    }

    @Override
    public List<UserClassCountStatisticsResponse> countStudentClass(UserDto user) {
        List<UserClassCountStatisticsResponse> list = new ArrayList<>();
        List<StudentClassDto> studentClassDtoList = userService.findStudentClassByUser(user);
        if (studentClassDtoList != null) {
            for (StudentClassDto studentClassDto : studentClassDtoList) {
                int count = userClassService.countUsersByClassId(studentClassDto);
                list.add(new UserClassCountStatisticsResponse(studentClassDto, count));
            }
        }
        return list;
    }
}
