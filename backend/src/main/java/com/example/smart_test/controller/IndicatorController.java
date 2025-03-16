package com.example.smart_test.controller;

import com.example.smart_test.domain.Indicator;
import com.example.smart_test.domain.Theme;
import com.example.smart_test.domain.User;
import com.example.smart_test.dto.IndicatorDto;
import com.example.smart_test.service.api.IndicatorServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/indicator")
public class IndicatorController {
    @Autowired
    private IndicatorServiceInterface indicatorService;

    @PostMapping("/add")
    public IndicatorDto addIndicator(@RequestBody IndicatorDto indicatorDto) {
        return indicatorService.addIndicatorDto(indicatorDto);
    }

    @DeleteMapping("/delete")
    public void deleteIndicator(@RequestBody IndicatorDto studentDto) {
        indicatorService.deleteIndicatorDto(studentDto);
    }

    @GetMapping("/all")
    public List<IndicatorDto> getAllIndicator() {
        return indicatorService.getAllIndicators();
    }

    /**
    Выводит список индикаторов по конкретной теме
    */
    @PostMapping("/indicator-by-theme")
    public List<IndicatorDto> getIndicatorsByTheme(@RequestBody Theme theme) {
        return indicatorService.getIndicatorsByTheme(theme);
    }

    /**
     Выводит список индикаторов пользователя
     */
    @PostMapping("/indicator-by-user")
    public List<IndicatorDto> getIndicatorsByIdUser(@RequestBody User user) {
        return indicatorService.getUserIndicators(user);
    }

    /**
     * Запрос для обновления данных индикатора
     * */
    @PutMapping("/update-indicator")
    public ResponseEntity<Indicator> updateIndicator(@RequestBody Indicator updatedIndicator) {
        Indicator indicator = indicatorService.updateIndicator(updatedIndicator);
        return ResponseEntity.ok(indicator);
    }

}
