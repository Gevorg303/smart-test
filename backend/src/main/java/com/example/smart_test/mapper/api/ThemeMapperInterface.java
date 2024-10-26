package com.example.smart_test.mapper.api;

import com.example.smart_test.domain.Theme;
import com.example.smart_test.dto.ThemeDto;

public interface ThemeMapperInterface {
    ThemeDto toDTO(Theme entity);

    Theme toEntity(ThemeDto dto);
}
