package com.example.smart_test.repository;


import com.example.smart_test.domain.TaskOfIndicator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskOfIndicatorRepositoryInterface extends JpaRepository<TaskOfIndicator, Long> {

}