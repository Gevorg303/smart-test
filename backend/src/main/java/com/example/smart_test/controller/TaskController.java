package com.example.smart_test.controller;

import com.example.smart_test.dto.TaskDto;
import com.example.smart_test.dto.TestDto;
import com.example.smart_test.dto.UserDto;
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

    /**
     Выводит задачи конкретного пользователя
     */
    @PostMapping("/get-user-tasks")
    public List<TaskDto> getUserTasks(@RequestBody UserDto userDto) {
        return taskService.getUserTasks(userDto);
    }

    /**
     * Добавляет задание в тест /task/add-task-to-test?testId=7&taskId=5
     * */
    @PutMapping("/add-task-to-test")
    public void addTaskToTest(@RequestParam Long testId, @RequestParam Long taskId){
        taskService.addTaskToTest(testId, taskId);
    }

    /**
     * Удаление задания из теста /task/remove-task-from-test?taskId=7
     * */
    @PutMapping("/remove-task-from-test")
    public void removeTaskFromTest (@RequestParam Long taskId){
        taskService.removeTaskFromTest(taskId);
    }

//    @GetMapping("/find-test")
//    public List<TaskDto> getFindTask() {
//        return taskService.getFindTask();
//    }
}
