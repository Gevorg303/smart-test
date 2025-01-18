package com.example.smart_test.mapper;

import com.example.smart_test.domain.ResponseOptionForTask;
import com.example.smart_test.dto.ResponseOptionForTaskDto;
import com.example.smart_test.mapper.api.ResponseOptionForTaskMapperInterface;
import org.springframework.stereotype.Component;

@Component
public class ResponseOptionForTaskMapperImpl implements ResponseOptionForTaskMapperInterface {
    @Override
    public ResponseOptionForTaskDto toDTO(ResponseOptionForTask entity) {
        ResponseOptionForTaskDto dto = new ResponseOptionForTaskDto();
        dto.setId(entity.getId());
        dto.setResponseOption(entity.getResponseOption());
        dto.setTask(entity.getTask());
        return dto;
    }

    @Override
    public ResponseOptionForTask toEntity(ResponseOptionForTaskDto dto) {
        ResponseOptionForTask entity = new ResponseOptionForTask();
        entity.setId(dto.getId());
        entity.setResponseOption(dto.getResponseOption());
        entity.setTask(dto.getTask());
        return entity;
    }
}