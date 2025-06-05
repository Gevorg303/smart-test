package com.example.smart_test.controller;

import com.example.smart_test.domain.Task;
import com.example.smart_test.dto.TaskDto;
import com.example.smart_test.dto.UserDto;
import com.example.smart_test.request.AddTaskRequest;
import com.example.smart_test.request.EditingTaskRequest;
import com.example.smart_test.service.api.TaskServiceInterface;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/task")
@Tag(name = "Task Controller", description = "API для управления заданиями")
public class TaskController {
    @Autowired
    private TaskServiceInterface taskService;

    @Operation(summary = "Добавить задачу", description = "Добавляет новую задачу в систему")
    @ApiResponse(responseCode = "200", description = "Задача успешно добавлена",
            content = @Content(schema = @Schema(implementation = TaskDto.class)))
    @PostMapping("/add")
    public TaskDto addTask(@RequestBody AddTaskRequest request) {
        return taskService.addTask(request.getTask(), request.getResponseOption(), request.getIndicator());
    }

    @Operation(summary = "Удалить задачу", description = "Удаляет указанную задачу из системы")
    @ApiResponse(responseCode = "200", description = "Задача успешно удалена")
    @DeleteMapping("/delete")
    public void deleteTask(@RequestBody Task task) {
        taskService.deleteTask(task, false);
    }

    @Operation(summary = "Получить все задачи", description = "Возвращает список всех задач")
    @ApiResponse(responseCode = "200", description = "Список задач успешно получен",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = TaskDto.class))))
    @GetMapping("/all")
    public List<TaskDto> getTaskDto() {
        return taskService.getAllTasks();
    }

    @Operation(summary = "Получить задачи пользователя", description = "Возвращает список задач, связанных с указанным пользователем")
    @ApiResponse(responseCode = "200", description = "Список задач пользователя успешно получен",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = TaskDto.class))))
    @PostMapping("/get-user-tasks")
    public List<TaskDto> getUserTasks(@RequestBody UserDto user) {
        return taskService.getUserTasks(user);
    }

    @Operation(summary = "Добавить задачу в тест", description = "Добавляет задачу в указанный тест")
    @ApiResponse(responseCode = "200", description = "Задача успешно добавлена в тест")
    @PutMapping("/add-task-to-test")
    public void addTaskToTest(@RequestParam Long testId, @RequestParam Long taskId){
        taskService.addTaskToTest(testId, taskId);
    }

    @Operation(summary = "Удалить задачу из теста", description = "Удаляет задачу из указанного теста")
    @ApiResponse(responseCode = "200", description = "Задача успешно удалена из теста")
    @PutMapping("/remove-task-from-test")
    public void removeTaskFromTest (@RequestBody TaskDto taskDto){
        taskService.removeTaskFromTest(taskDto);
    }

    @Operation(summary = "Обновить задачу", description = "Обновляет информацию о задаче")
    @ApiResponse(responseCode = "200", description = "Задача успешно обновлена")
    @PutMapping("/update-task")
    public void updateTask(@RequestBody EditingTaskRequest updatedTask) {
        taskService.updateTask(updatedTask);
    }
}
