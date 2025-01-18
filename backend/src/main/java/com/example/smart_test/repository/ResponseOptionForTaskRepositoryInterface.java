package com.example.smart_test.repository;

import com.example.smart_test.domain.Indicator;
import com.example.smart_test.domain.ResponseOptionForTask;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResponseOptionForTaskRepositoryInterface extends JpaRepository<ResponseOptionForTask, Long> {
    @NotNull List<ResponseOptionForTask> findAll();
}