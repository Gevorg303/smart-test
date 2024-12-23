package com.example.smart_test.service.api;

import com.example.smart_test.dto.TestDto;
import com.example.smart_test.dto.ThemeDto;

import java.util.List;

public interface TestServiceInterface {

    TestDto addTestDto(TestDto testDto);

    void deleteTestDto(TestDto testDto);

    List<TestDto> getAllTestDto();

    TestDto getTestById(Long id);

    List<TestDto> outputTestsByIDTheme(ThemeDto themeDto);
}
