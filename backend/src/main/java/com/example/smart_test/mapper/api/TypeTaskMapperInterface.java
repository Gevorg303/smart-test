package com.example.smart_test.mapper.api;

import com.example.smart_test.domain.TypeTask;
import com.example.smart_test.dto.TypeTaskDto;

public interface TypeTaskMapperInterface {
    public TypeTaskDto toDto(TypeTask entity);

    public TypeTask toEntity(TypeTaskDto dto);
}
