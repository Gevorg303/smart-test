package com.example.smart_test.service;

import com.example.smart_test.domain.Test;
import com.example.smart_test.domain.TestingAttempt;
import com.example.smart_test.domain.User;
import com.example.smart_test.dto.TestDto;
import com.example.smart_test.dto.TestingAttemptDto;
import com.example.smart_test.mapper.api.TestMapperInterface;
import com.example.smart_test.mapper.api.TestingAttemptMapperInterface;
import com.example.smart_test.repository.TestingAttemptRepositoryInterface;
import com.example.smart_test.service.api.TestingAttemptServiceInterface;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class TestingAttemptServiceImpl implements TestingAttemptServiceInterface {
    @Autowired
    private TestingAttemptRepositoryInterface testingAttemptRepository;
    @Autowired
    private TestingAttemptMapperInterface testingAttemptMapper;
    @Autowired
    private TestMapperInterface testMapper;

    @Override
    @Transactional
    public TestingAttemptDto addTestingAttempt(TestingAttemptDto testingAttempt) {
        return testingAttemptMapper.toDto(testingAttemptRepository.save(testingAttemptMapper.toEntity(testingAttempt)));
    }

    @Override
    public TestingAttemptDto findTopByUserAndTest_IdOrderByStartDateTimeDesc(User user, TestDto test) {
        return testingAttemptMapper.toDto(testingAttemptRepository.findTopByUserAndTest_IdOrderByStartDateTimeDesc(user, test.getId()));
    }

    @Override
    public List<TestingAttempt> findTestingAttemptByTest(User user, Test test) {
        return testingAttemptRepository.findByTestAndUser(test, user);
    }

    @Override
    public void deleteByTestId(TestDto test) {
        testingAttemptRepository.deleteByTestId(test.getId());
    }

    @Override
    public List<TestingAttemptDto> findByTest(TestDto test) {
        List<TestingAttempt> testingAttemptList = testingAttemptRepository.findByTest(testMapper.toEntity(test));
        List<TestingAttemptDto> testingAttemptDtoList = new ArrayList<>();
        if (testingAttemptList != null) {
            for (TestingAttempt testingAttempt : testingAttemptList) {
                testingAttemptDtoList.add(testingAttemptMapper.toDto(testingAttempt));
            }
        }
        return testingAttemptDtoList;
    }
}
