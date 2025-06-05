package com.example.smart_test.repository;


import com.example.smart_test.domain.Indicator;
import com.example.smart_test.domain.Task;
import com.example.smart_test.domain.TaskOfIndicator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskOfIndicatorRepositoryInterface extends JpaRepository<TaskOfIndicator, Long> {
    List<TaskOfIndicator> findByIndicatorId(Long indicatorId);
    List<TaskOfIndicator> findByTask(Task task);
    List<TaskOfIndicator> findByIndicator(Indicator indicator);
    List<TaskOfIndicator> findByTaskId(Long taskId);
    @Modifying
    @Query("DELETE FROM TaskOfIndicator t WHERE t.task.id = :taskId AND t.indicator.id = :indicatorId")
    void deleteByTaskIdAndIndicatorId(@Param("taskId") Long taskId, @Param("indicatorId") Long indicatorId);
    void deleteByIndicatorId(Long indicatorId);
    long countByTaskId(Long taskId);
}