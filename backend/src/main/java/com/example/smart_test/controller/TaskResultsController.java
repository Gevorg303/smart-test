package com.example.smart_test.controller;


import com.example.smart_test.service.api.TaskResultsServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("TestResults")
public class TaskResultsController {
    @Autowired
    private TaskResultsServiceInterface testResultsService;

//    @PostMapping("/add")
//    public TestResultsDto addTestResultsDto(@RequestBody TestResultsDto testResultsDto) {
//        return testResultsService.addTestResultsDto(testResultsDto);
//    }
//
//    @DeleteMapping("/delete")
//    public void deleteTestResultsDto(@RequestBody TestResultsDto testResultsDto) {
//        testResultsService.deleteTestResultsDto(testResultsDto);
//    }
//
//    @GetMapping("/all")
//    public List<TestResultsDto> getTestResultsDto() {
//        return testResultsService.getAllTestResults();
//    }
}
