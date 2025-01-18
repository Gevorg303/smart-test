package com.example.smart_test.service.api;

import com.example.smart_test.domain.Indicator;
import com.example.smart_test.domain.Task;
import com.example.smart_test.dto.TaskOfIndicatorDto;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TaskOfIndicatorServiceInterface {
    @Transactional
    void addTaskOfIndicator(Task task, Indicator indicator);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    void deleteTaskOfIndicatorDto(TaskOfIndicatorDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    List<TaskOfIndicatorDto> getAllTaskOfIndicators();
}
