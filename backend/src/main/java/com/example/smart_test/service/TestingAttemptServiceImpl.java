package com.example.smart_test.service;

import com.example.smart_test.domain.TestingAttempt;
import com.example.smart_test.repository.TestingAttemptRepositoryInterface;
import com.example.smart_test.service.api.TestingAttemptServiceInterface;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class TestingAttemptServiceImpl implements TestingAttemptServiceInterface {
    @Autowired
    private TestingAttemptRepositoryInterface testingAttemptRepository;

    @Override
    @Transactional
    public TestingAttempt addTestingAttempt(TestingAttempt testingAttempt) {
        return testingAttemptRepository.save(testingAttempt);
    }
}
