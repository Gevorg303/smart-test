package com.example.smart_test.controller;

import com.example.smart_test.dto.UserDto;
import com.example.smart_test.request.TeacherStatisticsResponse;
import com.example.smart_test.service.statistics.api.TeacherStatisticsServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/statistics")
public class TeacherStatisticsController {
    @Autowired
    private TeacherStatisticsServiceInterface teacherStatisticsService;

    /**
     * Получение статистики преподавателя по предметам и ученикам.
     * @param user преподаватель
     * @return список статистики по каждому предмету
     */
    @PostMapping("/teacher")
    public ResponseEntity<List<TeacherStatisticsResponse>> getTeacherStatistics(@RequestBody UserDto user) {
        List<TeacherStatisticsResponse> statistics = teacherStatisticsService.getTeacherStatistics(user);
        return ResponseEntity.ok(statistics);
    }
}
