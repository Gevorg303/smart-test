package com.example.smart_test.service.api;

import com.example.smart_test.domain.Task;
import com.example.smart_test.domain.TestingAttempt;
import com.example.smart_test.domain.User;
import com.example.smart_test.dto.*;
import com.example.smart_test.request.EndTestingRequest;
import com.example.smart_test.request.RequestForTask;
import com.example.smart_test.request.TestSimulatorRequest;
import com.example.smart_test.request.TestingAttemptAndTest;
import com.example.smart_test.response.ResponseForTask;
import com.example.smart_test.response.ResponseForTest;

import java.util.List;

public interface TestServiceInterface {

    TestDto addTestDto(TestDto testDto, List<Task> taskList);

    void deleteTestDto(TestDto testDto);

    List<TestDto> getAllTestDto();

    TestDto getTestById(Long id);

    List<TestDto> outputTestsByIDTheme(ThemeDto themeDto);

    List<TestDto> getUserTests(UserDto user);

    ResponseForTest endTesting(EndTestingRequest endTestingRequest);

    List<TaskDto> createTestSimulator(TestSimulatorRequest testSimulatorRequest);

    List<TestingAttemptDto> findTestingAttemptByTest(TestingAttemptAndTest request);
}
