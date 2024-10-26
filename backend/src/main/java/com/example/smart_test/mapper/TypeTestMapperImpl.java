package com.example.smart_test.mapper;

import com.example.smart_test.domain.TypeTest;
import com.example.smart_test.dto.TypeTestDto;
import com.example.smart_test.mapper.api.TypeTestMapperInterface;
import org.springframework.stereotype.Component;

@Component
public class TypeTestMapperImpl implements TypeTestMapperInterface {
    @Override
    public TypeTestDto toDto(TypeTest entity) {
        TypeTestDto dto = new TypeTestDto();
        dto.setId(entity.getId());
        dto.setNameOfTestType(entity.getNameOfTestType());
        return dto;
    }

    @Override
    public TypeTest toEntity(TypeTestDto dto) {
        TypeTest entity = new TypeTest();
        entity.setId(dto.getId());
        entity.setNameOfTestType(dto.getNameOfTestType());
        return entity;
    }

}
