package com.example.smart_test.mapper;

import com.example.smart_test.domain.Task;
import com.example.smart_test.dto.TaskDto;
import com.example.smart_test.mapper.api.TaskMapperInterface;
import org.springframework.stereotype.Component;

@Component
public class TaskMapperImpl implements TaskMapperInterface {
    @Override
    public TaskDto toDto(Task entity) {
        TaskDto dto = new TaskDto();
        dto.setId(entity.getId());
        dto.setTest(entity.getTest());
        dto.setTypeTask(entity.getTypeTask());
        dto.setExplanation(entity.getExplanation());
        dto.setTaskText(entity.getTaskText());
        return dto;
    }

    public Task toEntity(TaskDto dto) {
        Task entity = new Task();
        entity.setId(dto.getId());
        entity.setTest(dto.getTest());
        entity.setTypeTask(dto.getTypeTask());
        entity.setExplanation(dto.getExplanation());
        entity.setTaskText(dto.getTaskText());
        return entity;
    }
}
