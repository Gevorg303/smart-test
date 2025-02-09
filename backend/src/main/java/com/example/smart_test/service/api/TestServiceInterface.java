package com.example.smart_test.service.api;

import com.example.smart_test.domain.Task;
import com.example.smart_test.dto.TestDto;
import com.example.smart_test.dto.ThemeDto;
import com.example.smart_test.dto.UserDto;
import com.example.smart_test.request.EndTestingRequest;
import com.example.smart_test.request.RequestForTask;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface TestServiceInterface {

    TestDto addTestDto(TestDto testDto, List<Task> taskList);

    void deleteTestDto(TestDto testDto);

    List<TestDto> getAllTestDto();

    TestDto getTestById(Long id);

    List<TestDto> outputTestsByIDTheme(ThemeDto themeDto);

    List<TestDto> getUserTests(UserDto userDto);

    List<RequestForTask> endTesting(EndTestingRequest endTestingRequest);
}
