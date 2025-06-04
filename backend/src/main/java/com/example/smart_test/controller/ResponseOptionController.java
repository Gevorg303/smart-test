package com.example.smart_test.controller;

import com.example.smart_test.domain.ResponseOption;
import com.example.smart_test.dto.ResponseOptionDto;
import com.example.smart_test.dto.TaskDto;
import com.example.smart_test.service.api.ResponseOptionServiceInterface;
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
@RequestMapping("/response-option")
@Tag(name = "Response Option Controller", description = "API для управления вариантами ответов")
public class ResponseOptionController {
    @Autowired
    private ResponseOptionServiceInterface responseOptionService;

    @Operation(summary = "Получить варианты ответов по заданию", description = "Возвращает список вариантов ответов, связанных с указанным заданием")
    @ApiResponse(responseCode = "200", description = "Список вариантов ответов успешно получен",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = ResponseOptionDto.class))))
    @PostMapping("/find-response-option-by-task")
    public ResponseEntity<List<ResponseOptionDto>> getResponseOptionsByTask(@RequestBody TaskDto taskDto) {
        List<ResponseOptionDto> responseOptions = responseOptionService.getResponseOptionsByTask(taskDto);
        return ResponseEntity.ok(responseOptions);
    }

    @Operation(summary = "Удалить вариант ответа", description = "Удаляет указанный вариант ответа из системы")
    @ApiResponse(responseCode = "200", description = "Вариант ответа успешно удален")
    @DeleteMapping("/delete")
    public void deleteResponseOption(@RequestBody ResponseOptionDto responseOption) {
        responseOptionService.deleteResponseOption(responseOption);
    }

    @Operation(summary = "Получить все варианты ответов", description = "Возвращает список всех вариантов ответов")
    @ApiResponse(responseCode = "200", description = "Список вариантов ответов успешно получен",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = ResponseOptionDto.class))))
    @GetMapping("/all")
    public List<ResponseOptionDto> getAllResponseOption() {
        return responseOptionService.getAllResponseOptions();
    }
}
