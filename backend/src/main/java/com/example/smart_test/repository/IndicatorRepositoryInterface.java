package com.example.smart_test.repository;


import com.example.smart_test.domain.Indicator;
import com.example.smart_test.domain.Theme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface IndicatorRepositoryInterface extends JpaRepository<Indicator, Long> {
    List<Indicator> findByTheme(Theme theme);
    void deleteByThemeId(Long themeId);
    @Modifying
    @Query("DELETE FROM Indicator i WHERE i.id = :id")
    @Transactional
    void deleteByIndicatorId(@Param("id") Long id);

}