package com.example.smart_test.controller;

import com.example.smart_test.dto.TaskDto;
import com.example.smart_test.dto.TestDto;
import com.example.smart_test.dto.ThemeDto;
import com.example.smart_test.service.api.TaskServiceInterface;
import com.example.smart_test.service.api.TestServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/test")
public class TestController {
    @Autowired
    private TestServiceInterface testService;

    @Autowired
    private TaskServiceInterface taskService;

    @PostMapping("/add")
    public TestDto addTest(@RequestBody TestDto testDto) {
        return testService.addTestDto(testDto);
    }

    @DeleteMapping("/delete")
    public void deleteTest(@RequestBody TestDto testDto) {
        testService.deleteTestDto(testDto);
    }


    /**
    Выводит список всех тестов
     */
    @GetMapping("/all")
    public List<TestDto> getAllTest() {
        return testService.getAllTestDto();
    }

    /**
    Вывод информации про конкретный тест
    */
    @PostMapping("/get")
    public TestDto getTestById(@RequestBody TestDto testDto) {
        return testService.getTestById(testDto.getId());
    }

    @GetMapping("/id:{id}")
    public TestDto getTestByIdNoCookie(@PathVariable Long id) {
        return testService.getTestById(id);
    }

    /**
    Выводит список заданий в тесте
    */
    @PostMapping("/get-tasks-test")
    public List<TaskDto> findTasksTheTest(@RequestBody TestDto dto) {
        return taskService.findTasksTheTest(dto);
    }

    /**
     Выводит список доступных заданий для добавления в тест
     */
    @PostMapping("/get-available-tasks")
    public Set<TaskDto> displayTheAvailableTasks(@RequestBody TestDto dto){
        return taskService.displayTheAvailableTasks(dto);
    }
}
