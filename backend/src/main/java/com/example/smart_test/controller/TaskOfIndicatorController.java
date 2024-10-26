package com.example.smart_test.controller;

import com.example.smart_test.dto.SubjectTeacherDto;
import com.example.smart_test.dto.TaskOfIndicatorDto;
import com.example.smart_test.service.api.SubjectTeacherServiceInterface;
import com.example.smart_test.service.api.TaskOfIndicatorServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/task-of-indicator")
public class TaskOfIndicatorController {
    @Autowired
    private TaskOfIndicatorServiceInterface taskOfIndicatorService;

    @PostMapping("/add")
    public TaskOfIndicatorDto addTaskOfIndicatorDto(@RequestBody TaskOfIndicatorDto taskOfIndicatorDto) {
        return taskOfIndicatorService.addTaskOfIndicatorDto(taskOfIndicatorDto);
    }

    @DeleteMapping("/delete")
    public void deleteTaskOfIndicatorDto(@RequestBody TaskOfIndicatorDto taskOfIndicatorDto) {
        taskOfIndicatorService.deleteTaskOfIndicatorDto(taskOfIndicatorDto);
    }

    @GetMapping("/all")
    public List<TaskOfIndicatorDto> getTaskOfIndicatorDto() {
        return taskOfIndicatorService.getAllTaskOfIndicators();
    }
}
