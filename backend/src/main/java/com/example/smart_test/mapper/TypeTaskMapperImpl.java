package com.example.smart_test.mapper;

import com.example.smart_test.domain.TypeTask;
import com.example.smart_test.dto.TypeTaskDto;
import com.example.smart_test.mapper.api.TypeTaskMapperInterface;
import org.springframework.stereotype.Component;

@Component
public class TypeTaskMapperImpl implements TypeTaskMapperInterface {
    @Override
    public TypeTaskDto toDto(TypeTask entity) {
        TypeTaskDto dto = new TypeTaskDto();
        dto.setId(entity.getId());
        dto.setTaskTypeName(entity.getTaskTypeName());
        return dto;
    }

    @Override
    public TypeTask toEntity(TypeTaskDto dto) {
        TypeTask entity = new TypeTask();
        entity.setId(dto.getId());
        entity.setTaskTypeName(dto.getTaskTypeName());
        return entity;
    }
}
