package com.example.smart_test.controller;

import com.example.smart_test.dto.ResponseOptionDto;
import com.example.smart_test.service.api.ResponseOptionServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/response-option")
public class ResponseOptionController {
    @Autowired
    private ResponseOptionServiceInterface responseOptionService;

    @PostMapping("/add")
    public ResponseOptionDto addResponseOption(@RequestBody ResponseOptionDto responseOptionDto) {
        return responseOptionService.addResponseOptionDto(responseOptionDto);
    }

    @DeleteMapping("/delete")
    public void deleteResponseOption(@RequestBody ResponseOptionDto responseOptionDto) {
        responseOptionService.deleteResponseOptionDto(responseOptionDto);
    }

    @GetMapping("/all")
    public List<ResponseOptionDto> getAllResponseOption() {
        return responseOptionService.getAllResponseOptions();
    }
}
