package com.example.smart_test.controller;

import com.example.smart_test.request.EditingTaskRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.smart_test.domain.StudentClass;
import com.example.smart_test.dto.EducationalInstitutionDto;
import com.example.smart_test.dto.StudentClassDto;
import com.example.smart_test.service.api.StudentClassServiceInterface;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/student-class")
@Tag(name = "Student Class Controller", description = "API для управления классами студентов")
public class StudentClassController {
    @Autowired
    private StudentClassServiceInterface serviceInterface;

    @Operation(summary = "Добавить класс", description = "Добавляет новый класс в систему")
    @ApiResponse(responseCode = "200", description = "Класс успешно добавлен",
            content = @Content(schema = @Schema(implementation = StudentClassDto.class)))
    @PostMapping("/add")
    public StudentClassDto addStudentClass(@RequestBody StudentClassDto dto) {
        return serviceInterface.addStudentClassDto(dto);
    }

    @Operation(summary = "Удалить класс", description = "Удаляет указанный класс из системы")
    @ApiResponse(responseCode = "200", description = "Класс успешно удален")
    @DeleteMapping("/delete")
    public void deleteStudentClass(@RequestBody StudentClassDto dto) {
        serviceInterface.deleteStudentClassDto(dto);
    }

    @Operation(summary = "Найти классы по образовательному учреждению", description = "Возвращает список классов, связанных с указанным образовательным учреждением")
    @ApiResponse(responseCode = "200", description = "Список классов успешно получен",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = StudentClass.class))))
    @PostMapping("/find-class-by-educational-institution")
    public List<StudentClass> findClassByEducationalInstitution(@RequestBody EducationalInstitutionDto educationalInstitution) {
        return serviceInterface.findClassByEducationalInstitution(educationalInstitution);
    }

    @Operation(summary = "Получить классы по идентификатору учителя", description = "Возвращает список классов, связанных с указанным идентификатором учителя")
    @ApiResponse(responseCode = "200", description = "Список классов успешно получен",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = StudentClassDto.class))))
    @GetMapping("/teacherid={id}")
    public List<StudentClassDto> getAllStudentClassByTeacherId(@PathVariable Long id) {
        return serviceInterface.getStudentClassByUserId(id);
    }

    @Operation(summary = "Обновить класс", description = "Обновляет информацию о классе")
    @ApiResponse(responseCode = "200", description = "Класс успешно обновлен")
    @PutMapping("/update-class")
    public void updateClass(@RequestBody StudentClassDto studentClassDto) {
        serviceInterface.updateClass(studentClassDto);
    }
}
