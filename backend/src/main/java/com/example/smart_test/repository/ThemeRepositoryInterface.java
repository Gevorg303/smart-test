package com.example.smart_test.repository;

import com.example.smart_test.domain.Theme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThemeRepositoryInterface extends JpaRepository<Theme, Long> {
    List<Theme> findBySubjectId(Long id);
}
