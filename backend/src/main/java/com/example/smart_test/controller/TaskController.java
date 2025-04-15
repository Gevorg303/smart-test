package com.example.smart_test.controller;

import com.example.smart_test.domain.Task;
import com.example.smart_test.domain.User;
import com.example.smart_test.dto.TaskDto;
import com.example.smart_test.dto.UserDto;
import com.example.smart_test.request.AddTaskRequest;
import com.example.smart_test.request.RequestForTask;
import com.example.smart_test.service.api.TaskServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/task")
public class TaskController {
    @Autowired
    private TaskServiceInterface taskService;

    /**
     * Обрабатывает POST-запрос для добавления новой задачи.
     *
     * @param request Объединенный JSON-объект, содержащий данные задачи, варианта ответа и индикатора.
     * @return DTO объект задачи, который был создан и сохранен в базе данных.
     * @throws RuntimeException если произошла ошибка при добавлении задачи.
     */
    @PostMapping("/add")
    public TaskDto addTask(@RequestBody AddTaskRequest request) {
        return taskService.addTask(request.getTask(), request.getResponseOption(), request.getIndicator());
    }

    /**
     * Метод для удаления задания
     */
    @DeleteMapping("/delete")
    public void deleteTask(@RequestBody Task task) {
        taskService.deleteTask(task);
    }

    @GetMapping("/all")
    public List<TaskDto> getTaskDto() {
        return taskService.getAllTasks();
    }

    /**
     Выводит задачи конкретного пользователя
     */
    @PostMapping("/get-user-tasks")
    public List<TaskDto> getUserTasks(@RequestBody UserDto user) {
        return taskService.getUserTasks(user);
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
    public void removeTaskFromTest (@RequestBody TaskDto taskDto){
        taskService.removeTaskFromTest(taskDto);
    }

    /**
     * Запрос для обновления задания
     * */
    @PutMapping("/update-task")
    public void updateTask(@RequestBody RequestForTask updatedTask) {
        taskService.updateTask(updatedTask);
    }

//    @GetMapping("/find-test")
//    public List<TaskDto> getFindTask() {
//        return taskService.getFindTask();
//    }
}
