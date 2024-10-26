package com.example.smart_test.controller;

import com.example.smart_test.dto.TaskDto;
import com.example.smart_test.service.api.TaskServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/task")
public class TaskController {
    @Autowired
    private TaskServiceInterface taskService;

    @PostMapping("/add")
    public TaskDto addTaskDto(@RequestBody TaskDto taskDto) {
        return taskService.addTaskDto(taskDto);
    }

    @DeleteMapping("/delete")
    public void deleteTaskDto(@RequestBody TaskDto taskDto) {
        taskService.deleteTaskDto(taskDto);
    }

    @GetMapping("/all")
    public List<TaskDto> getTaskDto() {
        return taskService.getAllTasks();
    }

//    @GetMapping("/find-test")
//    public List<TaskDto> getFindTask() {
//        return taskService.getFindTask();
//    }
}
