package com.example.smart_test.controller;

import com.example.smart_test.domain.TestingAttempt;
import com.example.smart_test.domain.User;
import com.example.smart_test.dto.TaskDto;
import com.example.smart_test.dto.TestDto;
import com.example.smart_test.dto.TestingAttemptDto;
import com.example.smart_test.dto.ThemeDto;
import com.example.smart_test.request.*;
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
    public TestDto addTest(@RequestBody TestRequest testRequest) {
        return testService.addTestDto(testRequest.getTest(), testRequest.getTaskList());
    }

    @DeleteMapping("/delete")
    public void deleteTest(@RequestBody TestDto testDto) {
        testService.deleteTestDto(testDto);
    }

    /**
     * Выводит список всех тестов
     */
    @GetMapping("/all")
    public List<TestDto> getAllTest() {
        return testService.getAllTestDto();
    }

    /**
     * Вывод информации про конкретный тест
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
     * Выводит тесты конкретного пользователя
     */
    @PostMapping("/get-user-tests")
    public List<TestDto> getUserTests(@RequestBody User user) {
        return testService.getUserTests(user);
    }

    /**
     * Выводит список заданий в тесте
     */
    @PostMapping("/get-tasks-test")
    public List<TaskDto> findTasksTheTest(@RequestBody TestDto dto) {
        return taskService.findTasksTheTest(dto);
    }

    /**
     * Выводит список доступных заданий для добавления в тест, необходимо на вход id темы теста
     */
    @PostMapping("/get-available-tasks")
    public Set<TaskDto> displayTheAvailableTasks(@RequestBody ThemeDto dto) {
        return taskService.displayTheAvailableTasks(dto);
    }

    /**
     * Выводит список тестов по конкретной теме
     */
    @PostMapping("/get-test-id-theme")
    public List<TestDto> outputTestsByIDTheme(@RequestBody ThemeDto themeDto) {
        return testService.outputTestsByIDTheme(themeDto);
    }

    /**
     * Завершение тестирования
     */
    @PostMapping("/end-testing")
    public List<RequestForTask> endTesting(@RequestBody EndTestingRequest endTestingRequest){
        return testService.endTesting(endTestingRequest);
    }

    /**
     * Необходимо вызывать этот метод при нажатии на "Начать тестирование" у ТРЕНАЖЕРА!!!
     * */
    @PostMapping("/create-test-simulator")
    public List<TaskDto> createTestSimulator(@RequestBody TestSimulatorRequest testSimulatorRequest) {
        return testService.createTestSimulator(testSimulatorRequest);
    }

    /**
     * Метод выведет все попытки тестирования по тесту и пользователю
     * */
    @PostMapping("/find-testing-attempt-by-test")
    public List<TestingAttemptDto> findTestingAttemptByTest(@RequestBody TestingAttemptAndTest request) {
        return testService.findTestingAttemptByTest(request);
    }
}
