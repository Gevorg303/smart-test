package com.example.smart_test.repository;

import com.example.smart_test.domain.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestRepositoryInterface extends JpaRepository<Test, Long> {
}
