package com.example.smart_test.mapper;

import com.example.smart_test.domain.TaskOfIndicator;
import com.example.smart_test.dto.TaskOfIndicatorDto;
import com.example.smart_test.mapper.api.TaskOfIndicatorMapperInterface;
import org.springframework.stereotype.Component;

@Component
public class TaskOfIndicatorMapperImpl implements TaskOfIndicatorMapperInterface {
    @Override
    public TaskOfIndicatorDto toDto(TaskOfIndicator entity) {
        TaskOfIndicatorDto dto = new TaskOfIndicatorDto();
        dto.setId(entity.getId());
        dto.setIndicator(entity.getIndicator());
        dto.setTask(entity.getTask());
        return dto;
    }

    @Override
    public TaskOfIndicator toEntity(TaskOfIndicatorDto dto) {
        TaskOfIndicator entity = new TaskOfIndicator();
        entity.setId(dto.getId());
        entity.setIndicator(dto.getIndicator());
        entity.setTask(dto.getTask());
        return entity;
    }
}
