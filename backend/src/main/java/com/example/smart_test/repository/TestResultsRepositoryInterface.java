package com.example.smart_test.repository;


import com.example.smart_test.domain.TaskResults;
import com.example.smart_test.domain.TestingAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestResultsRepositoryInterface extends JpaRepository<TaskResults, Long> {
    List<TaskResults> findByTestingAttemptAndResultOfTheIndicatorFalse(TestingAttempt testingAttempt);
}