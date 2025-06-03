package com.example.smart_test.controller;


import com.example.smart_test.dto.TypeTaskDto;
import com.example.smart_test.service.api.TypeTaskServiceInterface;
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
@RequestMapping("TypeTask")
@Tag(name = "Type Task Controller", description = "API для управления типами задач")
public class TypeTaskController {
    @Autowired
    private TypeTaskServiceInterface typeTaskService;

    @Operation(summary = "Добавить тип задачи", description = "Добавляет новый тип задачи в систему")
    @ApiResponse(responseCode = "200", description = "Тип задачи успешно добавлен",
            content = @Content(schema = @Schema(implementation = TypeTaskDto.class)))
    @PostMapping("/add")
    public TypeTaskDto addTypeTaskDto(@RequestBody TypeTaskDto typeTaskDto) {
        return typeTaskService.addTypeTaskDto(typeTaskDto);
    }

    @Operation(summary = "Удалить тип задачи", description = "Удаляет указанный тип задачи из системы")
    @ApiResponse(responseCode = "200", description = "Тип задачи успешно удален")
    @DeleteMapping("/delete")
    public void deleteTypeTaskDto(@RequestBody TypeTaskDto typeTaskDto) {
        typeTaskService.deleteTypeTaskDto(typeTaskDto);
    }

    @Operation(summary = "Получить все типы задач", description = "Возвращает список всех типов задач")
    @ApiResponse(responseCode = "200", description = "Список типов задач успешно получен",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = TypeTaskDto.class))))
    @GetMapping("/all")
    public List<TypeTaskDto> getTypeTaskDto() {
        return typeTaskService.getAllTypeTasks();
    }
}
