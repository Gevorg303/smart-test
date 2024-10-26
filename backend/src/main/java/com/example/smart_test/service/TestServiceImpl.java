package com.example.smart_test.service;

import com.example.smart_test.domain.Test;
import com.example.smart_test.dto.TestDto;
import com.example.smart_test.mapper.api.TestMapperInterface;
import com.example.smart_test.repository.TestRepositoryInterface;
import com.example.smart_test.service.api.TestServiceInterface;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class TestServiceImpl implements TestServiceInterface {
    @Autowired
    private TestMapperInterface testMapper;
    @Autowired
    private TestRepositoryInterface testRepository;

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
}
