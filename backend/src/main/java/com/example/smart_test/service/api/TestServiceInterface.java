package com.example.smart_test.service.api;

import com.example.smart_test.domain.Task;
import com.example.smart_test.dto.*;
import com.example.smart_test.request.*;
import com.example.smart_test.response.ResponseForTest;

import java.util.List;
import java.util.Set;

public interface TestServiceInterface {

    TestDto addTestDto(TestDto testDto, List<Task> taskList);

    void deleteTestDto(TestDto testDto);

    List<TestDto> getAllTestDto();

    TestDto getTestById(Long id);

    List<TestDto> outputTestsByIDTheme(ThemeDto themeDto);

    Set<TestDto> getUserTests(UserDto user);

    ResponseForTest endTesting(EndTestingRequest endTestingRequest);

    Set<TaskDto> createTestSimulator(TestSimulatorRequest testSimulatorRequest);

    List<TestingAttemptDto> findTestingAttemptByTest(TestingAttemptAndTest request);

    void updateTest(EditingTheTestRequest request);

    void deleteByThemeId(Long themeId);
}
