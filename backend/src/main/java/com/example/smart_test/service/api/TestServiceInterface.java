package com.example.smart_test.service.api;

import com.example.smart_test.domain.Task;
import com.example.smart_test.domain.User;
import com.example.smart_test.dto.TestDto;
import com.example.smart_test.dto.ThemeDto;
import com.example.smart_test.request.EndTestingRequest;
import com.example.smart_test.request.RequestForTask;

import java.util.List;

public interface TestServiceInterface {

    TestDto addTestDto(TestDto testDto, List<Task> taskList);

    void deleteTestDto(TestDto testDto);

    List<TestDto> getAllTestDto();

    TestDto getTestById(Long id);

    List<TestDto> outputTestsByIDTheme(ThemeDto themeDto);

    List<TestDto> getUserTests(User user);

    List<RequestForTask> endTesting(EndTestingRequest endTestingRequest);
}
