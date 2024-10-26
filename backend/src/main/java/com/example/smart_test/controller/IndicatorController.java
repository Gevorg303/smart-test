package com.example.smart_test.controller;

import com.example.smart_test.dto.IndicatorDto;
import com.example.smart_test.service.api.IndicatorServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
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

}
