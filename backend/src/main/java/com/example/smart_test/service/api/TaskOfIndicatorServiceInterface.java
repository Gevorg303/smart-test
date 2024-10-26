package com.example.smart_test.service.api;

import com.example.smart_test.dto.TaskOfIndicatorDto;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TaskOfIndicatorServiceInterface {
    public TaskOfIndicatorDto addTaskOfIndicatorDto(TaskOfIndicatorDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteTaskOfIndicatorDto(TaskOfIndicatorDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<TaskOfIndicatorDto> getAllTaskOfIndicators();
}
