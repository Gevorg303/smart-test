package com.example.smart_test.controller;


import com.example.smart_test.dto.TypeTestDto;
import com.example.smart_test.service.api.TypeTestServiceInterface;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("type-test")
@Tag(name = "Type Test Controller", description = "API для управления типами тестов")
public class TypeTestController {
    @Autowired
    private TypeTestServiceInterface typeTestService;

    @Operation(summary = "Добавить тип теста", description = "Добавляет новый тип теста в систему")
    @ApiResponse(responseCode = "200", description = "Тип теста успешно добавлен",
            content = @Content(schema = @Schema(implementation = TypeTestDto.class)))
    @PostMapping("/add")
    public TypeTestDto addTypeTestDto(@RequestBody TypeTestDto typeTestDto) {
        return typeTestService.addTypeTestDto(typeTestDto);
    }

    @Operation(summary = "Удалить тип теста", description = "Удаляет указанный тип теста из системы")
    @ApiResponse(responseCode = "200", description = "Тип теста успешно удален")
    @DeleteMapping("/delete")
    public void deleteTypeTestDto(@RequestBody TypeTestDto typeTestDto) {
        typeTestService.deleteTypeTestDto(typeTestDto);
    }

    @Operation(summary = "Удалить тип теста", description = "Удаляет указанный тип теста из системы")
    @ApiResponse(responseCode = "200", description = "Тип теста успешно удален")
    @GetMapping("/all")
    public List<TypeTestDto> getTypeTestDto() {
        return typeTestService.getAllTypeTests();
    }
}
