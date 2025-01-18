package com.example.smart_test.mapper.api;

import com.example.smart_test.domain.ResponseOptionForTask;
import com.example.smart_test.dto.ResponseOptionForTaskDto;

public interface ResponseOptionForTaskMapperInterface {
    ResponseOptionForTaskDto toDTO(ResponseOptionForTask entity);

    ResponseOptionForTask toEntity(ResponseOptionForTaskDto dto);
}