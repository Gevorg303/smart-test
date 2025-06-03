package com.example.smart_test.controller;

import com.example.smart_test.dto.SubjectDto;
import com.example.smart_test.response.ClassStatusResponse;
import com.example.smart_test.request.SubjectClassRequest;
import com.example.smart_test.service.api.SubjectUserServiceInterface;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/user-subject")
@Slf4j
@Tag(name = "Subject User Controller", description = "API для управления связями между предметами и пользователями")
public class SubjectUserController {
    @Autowired
    private SubjectUserServiceInterface subjectService;

    @Operation(summary = "Подписать класс на предмет", description = "Подписывает класс на указанный предмет")
    @ApiResponse(responseCode = "200", description = "Класс успешно подписан на предмет",
            content = @Content(schema = @Schema(implementation = String.class)))
    @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера")
    @PostMapping("/add")
    public ResponseEntity<String> addSubjectTeacherDto(@RequestBody SubjectClassRequest request) {
        try {
            subjectService.addSubjectUserDto(request);
            return ResponseEntity.ok("Класс успешно подписан на предмет");
        } catch (Exception e) {
            log.error("Ошибка при подписании класса на предмет: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ошибка: " + e.getMessage());
        }
    }

    @Operation(summary = "Найти классы по предмету", description = "Возвращает список классов, связанных с указанным предметом, с информацией о статусе")
    @ApiResponse(responseCode = "200", description = "Список классов успешно получен",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = ClassStatusResponse.class))))
    @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера")
    @PostMapping("/find-class-by-subject")
    public ResponseEntity<?> findClassBySubject(@RequestBody SubjectDto dto) {
        try {
            Set<ClassStatusResponse> response = subjectService.findClassBySubject(dto);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Ошибка при поиске классов по предмету: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ошибка: " + e.getMessage());
        }
    }

    @Operation(summary = "Отписать класс от предмета", description = "Отписывает класс от указанного предмета")
    @ApiResponse(responseCode = "200", description = "Класс успешно отписан от предмета",
            content = @Content(schema = @Schema(implementation = String.class)))
    @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера")
    @DeleteMapping("/remove")
    public ResponseEntity<String> removeSubjectTeacherDto(@RequestBody SubjectClassRequest request) {
        try {
            subjectService.removeSubjectUserDto(request);
            return ResponseEntity.ok("Класс успешно отписан от предмета");
        } catch (Exception e) {
            log.error("Ошибка при отписке класса от предмета: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ошибка: " + e.getMessage());
        }
    }
}
