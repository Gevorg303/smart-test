package com.example.smart_test.controller;

import com.example.smart_test.dto.*;
import com.example.smart_test.request.*;
import com.example.smart_test.response.ResponseForTest;
import com.example.smart_test.service.api.TaskServiceInterface;
import com.example.smart_test.service.api.TestServiceInterface;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/test")
@Tag(name = "Test Controller", description = "API для управления тестами")
public class TestController {
    @Autowired
    private TestServiceInterface testService;

    @Autowired
    private TaskServiceInterface taskService;

    @Operation(summary = "Добавить тест", description = "Добавляет новый тест в систему")
    @ApiResponse(responseCode = "200", description = "Тест успешно добавлен",
            content = @Content(schema = @Schema(implementation = TestDto.class)))
    @PostMapping("/add")
    public TestDto addTest(@RequestBody TestRequest testRequest) {
        return testService.addTestDto(testRequest.getTest(), testRequest.getTaskList());
    }

    @Operation(summary = "Удалить тест", description = "Удаляет указанный тест из системы")
    @ApiResponse(responseCode = "200", description = "Тест успешно удален")
    @DeleteMapping("/delete")
    public void deleteTest(@RequestBody TestDto testDto) {
        testService.deleteTestDto(testDto);
    }

    @Operation(summary = "Получить все тесты", description = "Возвращает список всех тестов")
    @ApiResponse(responseCode = "200", description = "Список тестов успешно получен",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = TestDto.class))))
    @GetMapping("/all")
    public List<TestDto> getAllTest() {
        return testService.getAllTestDto();
    }

    @Operation(summary = "Получить тест по идентификатору", description = "Возвращает информацию о конкретном тесте по его идентификатору")
    @ApiResponse(responseCode = "200", description = "Информация о тесте успешно получена",
            content = @Content(schema = @Schema(implementation = TestDto.class)))
    @PostMapping("/get")
    public TestDto getTestById(@RequestBody TestDto testDto) {
        return testService.getTestById(testDto.getId());
    }

    @Operation(summary = "Получить тест по идентификатору без использования куки", description = "Возвращает информацию о конкретном тесте по его идентификатору без использования куки")
    @ApiResponse(responseCode = "200", description = "Информация о тесте успешно получена",
            content = @Content(schema = @Schema(implementation = TestDto.class)))
    @GetMapping("/id:{id}")
    public TestDto getTestByIdNoCookie(@PathVariable Long id) {
        return testService.getTestById(id);
    }

    @Operation(summary = "Получить тесты пользователя", description = "Возвращает список тестов, связанных с указанным пользователем")
    @ApiResponse(responseCode = "200", description = "Список тестов пользователя успешно получен",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = TestDto.class))))
    @PostMapping("/get-user-tests")
    public Set<TestDto> getUserTests(@RequestBody UserDto user) {
        return testService.getUserTests(user);
    }

    @Operation(summary = "Получить задачи теста", description = "Возвращает список задач, связанных с указанным тестом")
    @ApiResponse(responseCode = "200", description = "Список задач теста успешно получен",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = TaskDto.class))))
    @PostMapping("/get-tasks-test")
    public ResponseEntity<List<TaskDto>> findTasksTheTest(@RequestBody TestDto dto) {
        List<TaskDto> taskDtoList = taskService.findTasksTheTest(dto);
        return ResponseEntity.ok(taskDtoList);
    }

    @Operation(summary = "Получить доступные задачи", description = "Возвращает список доступных задач для добавления в тест по указанной теме")
    @ApiResponse(responseCode = "200", description = "Список доступных задач успешно получен",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = TaskDto.class))))
    @PostMapping("/get-available-tasks")
    public Set<TaskDto> displayTheAvailableTasks(@RequestBody ThemeDto dto) {
        return taskService.displayTheAvailableTasks(dto);
    }

    @Operation(summary = "Получить тесты по теме", description = "Возвращает список тестов, связанных с указанной темой")
    @ApiResponse(responseCode = "200", description = "Список тестов по теме успешно получен",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = TestDto.class))))
    @PostMapping("/get-test-id-theme")
    public List<TestDto> outputTestsByIDTheme(@RequestBody ThemeDto themeDto) {
        return testService.outputTestsByIDTheme(themeDto);
    }

    @Operation(summary = "Завершение тестирования", description = "Завершает процесс тестирования и возвращает результат")
    @ApiResponse(responseCode = "200", description = "Тестирование успешно завершено",
            content = @Content(schema = @Schema(implementation = ResponseForTest.class)))
    @PostMapping("/end-testing")
    public ResponseEntity<ResponseForTest> endTesting(@RequestBody EndTestingRequest endTestingRequest){
        ResponseForTest responseForTest =  testService.endTesting(endTestingRequest);
        return ResponseEntity.ok(responseForTest);
    }

    @Operation(summary = "Создать тест-симулятор", description = "Создает тест-симулятор на основе предоставленных данных")
    @ApiResponse(responseCode = "200", description = "Тест-симулятор успешно создан",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = TaskDto.class))))
    @PostMapping("/create-test-simulator")
    public Set<TaskDto> createTestSimulator(@RequestBody TestSimulatorRequest testSimulatorRequest) {
        return testService.createTestSimulator(testSimulatorRequest);
    }

    @Operation(summary = "Найти попытки тестирования по тесту", description = "Возвращает список попыток тестирования по указанному тесту и пользователю")
    @ApiResponse(responseCode = "200", description = "Список попыток тестирования успешно получен",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = TestingAttemptDto.class))))
    @PostMapping("/find-testing-attempt-by-test")
    public List<TestingAttemptDto> findTestingAttemptByTest(@RequestBody TestingAttemptAndTest request) {
        return testService.findTestingAttemptByTest(request);
    }

    @Operation(summary = "Обновить тест", description = "Обновляет информацию о тесте на основе предоставленных данных")
    @ApiResponse(responseCode = "200", description = "Тест успешно обновлен")
    @PutMapping("update-test")
    public void updateTest(@RequestBody EditingTheTestRequest request) {
        testService.updateTest(request);
    }
}
