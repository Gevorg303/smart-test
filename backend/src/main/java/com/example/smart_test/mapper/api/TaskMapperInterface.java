package com.example.smart_test.mapper.api;

import com.example.smart_test.domain.Task;
import com.example.smart_test.dto.TaskDto;

public interface TaskMapperInterface {
    public TaskDto toDto(Task entity);

    public Task toEntity(TaskDto dto);
}
