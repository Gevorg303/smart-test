package com.example.smart_test.controller;


import com.example.smart_test.dto.TestResultsDto;
import com.example.smart_test.service.api.TestResultsServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("TestResults")
public class TestResultsController {
    @Autowired
    private TestResultsServiceInterface testResultsService;

    @PostMapping("/add")
    public TestResultsDto addTestResultsDto(@RequestBody TestResultsDto testResultsDto) {
        return testResultsService.addTestResultsDto(testResultsDto);
    }

    @DeleteMapping("/delete")
    public void deleteTestResultsDto(@RequestBody TestResultsDto testResultsDto) {
        testResultsService.deleteTestResultsDto(testResultsDto);
    }

    @GetMapping("/all")
    public List<TestResultsDto> getTestResultsDto() {
        return testResultsService.getAllTestResults();
    }
}
