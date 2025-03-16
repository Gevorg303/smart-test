package com.example.smart_test.service.api;

import com.example.smart_test.domain.Indicator;
import com.example.smart_test.domain.Task;
import com.example.smart_test.domain.TaskOfIndicator;
import com.example.smart_test.dto.IndicatorDto;
import com.example.smart_test.dto.TaskDto;
import com.example.smart_test.dto.TaskOfIndicatorDto;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TaskOfIndicatorServiceInterface {
    @Transactional
    void addTaskOfIndicator(Task task, Indicator indicator);

    @Transactional
    void deleteTaskOfIndicator(TaskOfIndicator taskOfIndicator);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    List<TaskOfIndicatorDto> getAllTaskOfIndicators();

    @Transactional
    List<TaskOfIndicator> findTaskOfIndicatorByIdTask(Task task);

    @Transactional
    List<TaskOfIndicator> findTaskOfIndicatorByIdIndicator(Indicator indicator);

    List<TaskOfIndicator> findTaskOfIndicatorByTask(Task task);

    List<TaskOfIndicator> findTaskOfIndicatorByIndicator(Indicator indicator);

    List<IndicatorDto> findIndicatorByTask(Task task);
}
