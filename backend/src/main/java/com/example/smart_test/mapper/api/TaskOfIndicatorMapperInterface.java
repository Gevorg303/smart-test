package com.example.smart_test.mapper.api;

import com.example.smart_test.domain.TaskOfIndicator;
import com.example.smart_test.dto.TaskOfIndicatorDto;

public interface TaskOfIndicatorMapperInterface {
    public TaskOfIndicatorDto toDto(TaskOfIndicator entity);

    public TaskOfIndicator toEntity(TaskOfIndicatorDto dto);
}
