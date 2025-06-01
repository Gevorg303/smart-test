package com.example.smart_test.repository;


import com.example.smart_test.domain.TaskResults;
import com.example.smart_test.domain.TestingAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface TaskResultsRepositoryInterface extends JpaRepository<TaskResults, Long> {
    List<TaskResults> findByTestingAttemptAndResultOfTheIndicatorFalse(TestingAttempt testingAttempt);
    @Modifying
    @Transactional
    @Query("DELETE FROM TaskResults tr WHERE tr.testingAttempt.id = :testingAttemptId")
    void deleteByTestingAttemptId(@Param("testingAttemptId") Long testingAttemptId);
    void deleteByTaskId(Long taskId);
    List<TaskResults> findByTaskId(Long taskId);
}