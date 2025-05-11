package com.example.smart_test.controller;

import com.example.smart_test.dto.UserDto;
import com.example.smart_test.request.TeacherStatisticsResponse;
import com.example.smart_test.response.AdminStatisticsResponse;
import com.example.smart_test.service.statistics.api.AdminStatisticsServiceInterface;
import com.example.smart_test.service.statistics.api.TeacherStatisticsServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/statistics")
public class StatisticsController {
    @Autowired
    private TeacherStatisticsServiceInterface teacherStatisticsService;
    @Autowired
    private AdminStatisticsServiceInterface adminStatisticsService;

    /**
     * Вывод отличников, хорошистов, троешников и двоешников по предметам учителя
     * */
    @PostMapping("/teacher")
    public ResponseEntity<List<TeacherStatisticsResponse>> getTeacherStatistics(@RequestBody UserDto user) {
        List<TeacherStatisticsResponse> statistics = teacherStatisticsService.getTeacherStatistics(user);
        return ResponseEntity.ok(statistics);
    }

    /**
     * Вывод количества администраторов, учителей и учеников в школе
     * */
    @PostMapping("/admin")
    public ResponseEntity<List<AdminStatisticsResponse>> getAdminStatistics(@RequestBody UserDto user) {
        List<AdminStatisticsResponse> statistics = adminStatisticsService.countUser(user);
        return ResponseEntity.ok(statistics);
    }
}
