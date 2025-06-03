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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/statistics")
@Tag(name = "Statistics Controller", description = "API для получения статистики")
public class StatisticsController {
    @Autowired
    private TeacherStatisticsServiceInterface teacherStatisticsService;
    @Autowired
    private AdminStatisticsServiceInterface adminStatisticsService;
    @Autowired
    private StudentStatisticsServiceInterface studentStatisticsService;

    @Operation(summary = "Получить статистику учителя", description = "Возвращает статистику по ученикам учителя, включая отличников, хорошистов, троечников и двоечников по предметам")
    @ApiResponse(responseCode = "200", description = "Статистика успешно получена",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = TeacherStatisticsResponse.class))))
    @PostMapping("/teacher")
    public ResponseEntity<List<TeacherStatisticsResponse>> getTeacherStatistics(@RequestBody TeacherStatisticsRequest request) {
        List<TeacherStatisticsResponse> statistics = teacherStatisticsService.getTeacherStatistics(request.getUser(), request.getSubject());
        return ResponseEntity.ok(statistics);
    }

    @Operation(summary = "Получить количество пользователей", description = "Возвращает количество администраторов, учителей и учеников в школе")
    @ApiResponse(responseCode = "200", description = "Количество пользователей успешно получено",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = UserCountStatisticsResponse.class))))
    @PostMapping("/admin-count-user")
    public ResponseEntity<List<UserCountStatisticsResponse>> countUser(@RequestBody UserDto user) {
        List<UserCountStatisticsResponse> statistics = adminStatisticsService.countUser(user);
        return ResponseEntity.ok(statistics);
    }

    @Operation(summary = "Получить количество учеников в классах", description = "Возвращает количество учеников в классах школы")
    @ApiResponse(responseCode = "200", description = "Количество учеников в классах успешно получено",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = UserClassCountStatisticsResponse.class))))
    @PostMapping("/admin-count-student-class")
    public ResponseEntity<List<UserClassCountStatisticsResponse>> countStudentClass(@RequestBody UserDto user) {
        List<UserClassCountStatisticsResponse> statistics = adminStatisticsService.countStudentClass(user);
        return ResponseEntity.ok(statistics);
    }

    @Operation(summary = "Получить статистику ученика", description = "Возвращает средний балл по предметам для указанного ученика")
    @ApiResponse(responseCode = "200", description = "Статистика ученика успешно получена",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = StudentStatisticsResponse.class))))
    @PostMapping("/student")
    public ResponseEntity<List<StudentStatisticsResponse>> getStudentStatistics(@RequestBody UserDto user) {
        List<StudentStatisticsResponse> statistics = studentStatisticsService.getStudentStatistics(user);
        return ResponseEntity.ok(statistics);
    }
}
