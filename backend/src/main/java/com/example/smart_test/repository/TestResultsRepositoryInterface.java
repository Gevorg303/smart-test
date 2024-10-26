package com.example.smart_test.repository;


import com.example.smart_test.domain.TestResults;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestResultsRepositoryInterface extends JpaRepository<TestResults, Long> {

}