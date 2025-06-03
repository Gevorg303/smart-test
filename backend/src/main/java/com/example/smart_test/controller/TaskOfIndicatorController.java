package com.example.smart_test.controller;

import com.example.smart_test.domain.Indicator;
import com.example.smart_test.domain.Task;
import com.example.smart_test.domain.TaskOfIndicator;
import com.example.smart_test.dto.IndicatorDto;
import com.example.smart_test.dto.TaskDto;
import com.example.smart_test.dto.TaskOfIndicatorDto;
import com.example.smart_test.service.api.TaskOfIndicatorServiceInterface;
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
@RequestMapping("/task-of-indicator")
@Tag(name = "Task of Indicator Controller", description = "API для управления задачами и индикаторами")
public class TaskOfIndicatorController {
    @Autowired
    private TaskOfIndicatorServiceInterface taskOfIndicatorService;

    @Operation(summary = "Получить индикаторы по заданию", description = "Возвращает список индикаторов, связанных с указанным заданием")
    @ApiResponse(responseCode = "200", description = "Список индикаторов успешно получен",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = IndicatorDto.class))))
    @PostMapping("/find-indicator-by-task")
    public ResponseEntity<List<IndicatorDto>> getIndicatorsByTask(@RequestBody Task task) {
        List<IndicatorDto> indicators = taskOfIndicatorService.findIndicatorByTask(task);
        return ResponseEntity.ok(indicators);
    }
}
