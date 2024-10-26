package com.example.smart_test.repository;


import com.example.smart_test.domain.Indicator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IndicatorRepositoryInterface extends JpaRepository<Indicator, Long> {

}