package com.example.smart_test.repository;

import com.example.smart_test.domain.Test;
import com.example.smart_test.domain.TestingAttempt;
import com.example.smart_test.domain.User;
import com.example.smart_test.dto.TestDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestingAttemptRepositoryInterface extends JpaRepository<TestingAttempt, Long> {
    TestingAttempt findTopByUserAndTest_IdOrderByStartDateTimeDesc(User user, Long idTest);
}
