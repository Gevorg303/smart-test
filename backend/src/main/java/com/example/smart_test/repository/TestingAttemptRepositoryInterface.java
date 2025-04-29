package com.example.smart_test.repository;

import com.example.smart_test.domain.Test;
import com.example.smart_test.domain.TestingAttempt;
import com.example.smart_test.domain.User;
import com.example.smart_test.dto.TestDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestingAttemptRepositoryInterface extends JpaRepository<TestingAttempt, Long> {
    TestingAttempt findTopByUserAndTest_IdOrderByStartDateTimeDesc(User user, Long idTest);
    List<TestingAttempt> findByTestAndUser(Test test, User user);
    void deleteByTestId(Long testId);
    List<TestingAttempt> findByTest(Test test);
}
