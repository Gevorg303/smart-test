package com.example.smart_test.service;

import com.example.smart_test.domain.Test;
import com.example.smart_test.dto.*;
import com.example.smart_test.mapper.api.TestMapperInterface;
import com.example.smart_test.repository.TestRepositoryInterface;
import com.example.smart_test.service.api.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Slf4j
public class TestServiceImpl implements TestServiceInterface {
    @Autowired
    private TestMapperInterface testMapper;
    @Autowired
    private TestRepositoryInterface testRepository;
    @Autowired
    private UserServiceInterface userService;
    @Autowired
    private SubjectUserServiceInterface subjectUserService;
    @Autowired
    private ThemeServiceInterface themeService;

    @Override
    public TestDto addTestDto(TestDto testDto) {
        Test test = testMapper.toEntity(testDto);
        Test savedTest = testRepository.save(test);
        return testMapper.toDto(savedTest);
    }

    @Override
    public void deleteTestDto(TestDto testDto) {
        testRepository.deleteById(testDto.getId());
    }

    @Override
    public List<TestDto> getAllTestDto() {
        try {
            List<Test> tests = testRepository.findAll();
            return tests.stream()
                    .map(testMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при получении всех тестов: " + e.getMessage(), e);
        }
    }

    @Override
    public TestDto getTestById(Long id) {
        try {
            Test test = testRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Тест не найден"));
            return testMapper.toDto(test);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при получении теста: " + e.getMessage(), e);
        }
    }

    @Override
    public List<TestDto> outputTestsByIDTheme(ThemeDto themeDto) {
        List<TestDto> testDtoList = new ArrayList<>();
        for (TestDto testDto : getAllTestDto()) {
            if (testDto.getTheme().getId().equals(themeDto.getId())) {
                testDtoList.add(testDto);
            }
        }
        return testDtoList;
    }

    @Override
    public List<TestDto> getUserTests(UserDto dto) {
        List<TestDto> testDtoList = new ArrayList<>();
        UserDto userDto = userService.getUserByLogin(dto);
        for (SubjectTeacherDto subjectTeacherDto : subjectUserService.getAllSubjectTeachers()) {
            if (userDto.getId().equals(subjectTeacherDto.getUser().getId())) {
                for (ThemeDto themeDto : themeService.getAllTheme()) {
                    if (themeDto.getSubject() == subjectTeacherDto.getSubject()) {
                        for (TestDto testDto : getAllTestDto()) {
                            if (Objects.equals(testDto.getTheme().getId(), themeDto.getId())) {
                                testDtoList.add(testDto);
                            }
                        }
                    }
                }
            }
        }
        return testDtoList;
    }
}
