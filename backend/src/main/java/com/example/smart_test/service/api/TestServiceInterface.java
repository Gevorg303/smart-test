package com.example.smart_test.service.api;

import com.example.smart_test.domain.Task;
import com.example.smart_test.domain.TestingAttempt;
import com.example.smart_test.domain.User;
import com.example.smart_test.dto.*;
import com.example.smart_test.request.EndTestingRequest;
import com.example.smart_test.request.RequestForTask;
import com.example.smart_test.request.TestSimulatorRequest;
import com.example.smart_test.request.TestingAttemptAndTest;

import java.util.List;

public interface TestServiceInterface {

    TestDto addTestDto(TestDto testDto, List<Task> taskList);

    void deleteTestDto(TestDto testDto);

    List<TestDto> getAllTestDto();

    TestDto getTestById(Long id);

    List<TestDto> outputTestsByIDTheme(ThemeDto themeDto);

    List<TestDto> getUserTests(User user);

    List<RequestForTask> endTesting(EndTestingRequest endTestingRequest);

    List<TaskDto> createTestSimulator(TestSimulatorRequest testSimulatorRequest);

    List<TestingAttemptDto> findTestingAttemptByTest(TestingAttemptAndTest request);
}
