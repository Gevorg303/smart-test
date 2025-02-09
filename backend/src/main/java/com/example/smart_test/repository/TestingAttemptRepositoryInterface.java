package com.example.smart_test.repository;

import com.example.smart_test.domain.TestingAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestingAttemptRepositoryInterface extends JpaRepository<TestingAttempt, Long> {
}
