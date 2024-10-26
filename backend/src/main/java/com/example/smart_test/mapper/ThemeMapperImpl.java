package com.example.smart_test.mapper;

import com.example.smart_test.domain.Theme;
import com.example.smart_test.dto.ThemeDto;
import com.example.smart_test.mapper.api.ThemeMapperInterface;
import org.springframework.stereotype.Component;

@Component
public class ThemeMapperImpl implements ThemeMapperInterface {
    @Override
    public ThemeDto toDTO(Theme entity) {
        ThemeDto dto = new ThemeDto();
        dto.setId(entity.getId());
        dto.setThemeName(entity.getThemeName());
        dto.setSubject(entity.getSubject());
        return dto;
    }

    @Override
    public Theme toEntity(ThemeDto dto) {
        Theme entity = new Theme();
        entity.setId(dto.getId());
        entity.setThemeName(dto.getThemeName());
        entity.setSubject(dto.getSubject());
        return entity;
    }
}
