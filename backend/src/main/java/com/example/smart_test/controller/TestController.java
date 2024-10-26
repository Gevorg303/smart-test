package com.example.smart_test.controller;

import com.example.smart_test.dto.TestDto;
import com.example.smart_test.dto.ThemeDto;
import com.example.smart_test.service.api.TestServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/test")
public class TestController {
    @Autowired
    private TestServiceInterface testService;

    @PostMapping("/add")
    public TestDto addTest(@RequestBody TestDto testDto) {
        return testService.addTestDto(testDto);
    }

    @DeleteMapping("/delete")
    public void deleteTest(@RequestBody TestDto testDto) {
        testService.deleteTestDto(testDto);
    }

    @GetMapping("/all")
    public List<TestDto> getAllTest() {
        return testService.getAllTestDto();
    }

    /*Вывод информации про конкретную тему*/
    @PostMapping("/get")
    public TestDto getTestById(@RequestBody TestDto testDto) {
        return testService.getTestById(testDto.getId());
    }
}
