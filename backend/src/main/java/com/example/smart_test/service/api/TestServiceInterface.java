package com.example.smart_test.service.api;

import com.example.smart_test.dto.TestDto;

import java.util.List;

public interface TestServiceInterface {

    TestDto addTestDto(TestDto testDto);

    void deleteTestDto(TestDto testDto);

    List<TestDto> getAllTestDto();

    TestDto getTestById(Long id);
}
