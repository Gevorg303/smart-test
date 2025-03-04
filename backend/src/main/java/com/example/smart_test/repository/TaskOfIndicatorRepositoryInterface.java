package com.example.smart_test.repository;


import com.example.smart_test.domain.Indicator;
import com.example.smart_test.domain.Task;
import com.example.smart_test.domain.TaskOfIndicator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskOfIndicatorRepositoryInterface extends JpaRepository<TaskOfIndicator, Long> {
    List<TaskOfIndicator> findByIndicatorId(Long indicatorId);
    List<TaskOfIndicator> findByTask(Task task);
    List<TaskOfIndicator> findByIndicator(Indicator indicator);
}