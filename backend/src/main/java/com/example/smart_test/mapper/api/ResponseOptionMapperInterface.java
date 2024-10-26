package com.example.smart_test.mapper.api;

import com.example.smart_test.domain.ResponseOption;
import com.example.smart_test.dto.ResponseOptionDto;

public interface ResponseOptionMapperInterface {
    public ResponseOptionDto toDTO(ResponseOption entity);

    public ResponseOption toEntity(ResponseOptionDto dto);
}
