package com.example.smart_test.mapper.api;

import com.example.smart_test.domain.TypeTest;
import com.example.smart_test.dto.TypeTestDto;

public interface TypeTestMapperInterface {
    public TypeTestDto toDto(TypeTest entity);

    public TypeTest toEntity(TypeTestDto dto);
}
