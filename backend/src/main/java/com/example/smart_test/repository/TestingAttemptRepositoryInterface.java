package com.example.smart_test.repository;

import com.example.smart_test.domain.Test;
import com.example.smart_test.domain.TestingAttempt;
import com.example.smart_test.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TestingAttemptRepositoryInterface extends JpaRepository<TestingAttempt, Long> {
    TestingAttempt findTopByUserIdAndTestIdOrderByStartDateTimeDesc(Long userId, Long testId);
    List<TestingAttempt> findByTestAndUser(Test test, User user);
    void deleteByTestId(Long testId);
    List<TestingAttempt> findByTest(Test test);
}
