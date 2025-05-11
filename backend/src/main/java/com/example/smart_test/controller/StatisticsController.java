package com.example.smart_test.controller;

import com.example.smart_test.dto.UserDto;
import com.example.smart_test.request.TeacherStatisticsRequest;
import com.example.smart_test.request.TeacherStatisticsResponse;
import com.example.smart_test.response.StudentStatisticsResponse;
import com.example.smart_test.response.UserClassCountStatisticsResponse;
import com.example.smart_test.response.UserCountStatisticsResponse;
import com.example.smart_test.service.statistics.api.AdminStatisticsServiceInterface;
import com.example.smart_test.service.statistics.api.StudentStatisticsServiceInterface;
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
    @Autowired
    private StudentStatisticsServiceInterface studentStatisticsService;

    /**
     * Вывод отличников, хорошистов, троешников и двоешников по предметам учителя
     * */
    @PostMapping("/teacher")
    public ResponseEntity<List<TeacherStatisticsResponse>> getTeacherStatistics(@RequestBody TeacherStatisticsRequest request) {
        List<TeacherStatisticsResponse> statistics = teacherStatisticsService.getTeacherStatistics(request.getUser(), request.getSubject());
        return ResponseEntity.ok(statistics);
    }

    /**
     * Вывод количества администраторов, учителей и учеников в школе
     * */
    @PostMapping("/admin-count-user")
    public ResponseEntity<List<UserCountStatisticsResponse>> countUser(@RequestBody UserDto user) {
        List<UserCountStatisticsResponse> statistics = adminStatisticsService.countUser(user);
        return ResponseEntity.ok(statistics);
    }

    /**
     * Вывод количества учеников в классах школы
     * */
    @PostMapping("/admin-count-student-class")
    public ResponseEntity<List<UserClassCountStatisticsResponse>> countStudentClass(@RequestBody UserDto user) {
        List<UserClassCountStatisticsResponse> statistics = adminStatisticsService.countStudentClass(user);
        return ResponseEntity.ok(statistics);
    }

    /**
     * Вывод среднего балла по предметам ученика
     * */
    @PostMapping("/student")
    public ResponseEntity<List<StudentStatisticsResponse>> getStudentStatistics(@RequestBody UserDto user) {
        List<StudentStatisticsResponse> statistics = studentStatisticsService.getStudentStatistics(user);
        return ResponseEntity.ok(statistics);
    }
}
