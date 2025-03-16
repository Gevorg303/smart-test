package com.example.smart_test.repository;

import com.example.smart_test.domain.ResponseOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResponseOptionRepositoryInterface extends JpaRepository<ResponseOption, Long> {
    List<ResponseOption> findByTaskId(Long taskId);
}
