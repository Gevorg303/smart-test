package com.example.smart_test.controller;

import com.example.smart_test.domain.Indicator;
import com.example.smart_test.domain.Theme;
import com.example.smart_test.domain.User;
import com.example.smart_test.dto.IndicatorDto;
import com.example.smart_test.dto.UserDto;
import com.example.smart_test.service.api.IndicatorServiceInterface;
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
@RequestMapping("/indicator")
@Tag(name = "Indicator Controller", description = "API для управления индикаторами")
public class IndicatorController {
    @Autowired
    private IndicatorServiceInterface indicatorService;

    @Operation(summary = "Добавить индикатор", description = "Добавляет новый индикатор в систему")
    @ApiResponse(responseCode = "200", description = "Индикатор успешно добавлен",
            content = @Content(schema = @Schema(implementation = IndicatorDto.class)))
    @PostMapping("/add")
    public IndicatorDto addIndicator(@RequestBody IndicatorDto indicatorDto) {
        return indicatorService.addIndicatorDto(indicatorDto);
    }

    @Operation(summary = "Удалить индикатор", description = "Удаляет указанный индикатор из системы")
    @ApiResponse(responseCode = "200", description = "Индикатор успешно удален")
    @DeleteMapping("/delete")
    public void deleteIndicator(@RequestBody IndicatorDto studentDto) {
        indicatorService.deleteIndicatorDto(studentDto);
    }

    @Operation(summary = "Получить все индикаторы", description = "Возвращает список всех индикаторов")
    @ApiResponse(responseCode = "200", description = "Список индикаторов успешно получен",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = IndicatorDto.class))))
    @GetMapping("/all")
    public List<IndicatorDto> getAllIndicator() {
        return indicatorService.getAllIndicators();
    }

    @Operation(summary = "Получить индикаторы по теме", description = "Возвращает список индикаторов, связанных с указанной темой")
    @ApiResponse(responseCode = "200", description = "Список индикаторов успешно получен",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = IndicatorDto.class))))
    @PostMapping("/indicator-by-theme")
    public List<IndicatorDto> getIndicatorsByTheme(@RequestBody Theme theme) {
        return indicatorService.getIndicatorsByTheme(theme);
    }

    @Operation(summary = "Получить индикаторы пользователя", description = "Возвращает список индикаторов, связанных с указанным пользователем")
    @ApiResponse(responseCode = "200", description = "Список индикаторов пользователя успешно получен",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = IndicatorDto.class))))
    @PostMapping("/indicator-by-user")
    public List<IndicatorDto> getIndicatorsByIdUser(@RequestBody UserDto user) {
        return indicatorService.getUserIndicators(user);
    }

    @Operation(summary = "Обновить индикатор", description = "Обновляет информацию об индикаторе")
    @ApiResponse(responseCode = "200", description = "Индикатор успешно обновлен",
            content = @Content(schema = @Schema(implementation = Indicator.class)))
    @PutMapping("/update-indicator")
    public ResponseEntity<Indicator> updateIndicator(@RequestBody IndicatorDto updatedIndicator) {
        Indicator indicator = indicatorService.updateIndicator(updatedIndicator);
        return ResponseEntity.ok(indicator);
    }
}
