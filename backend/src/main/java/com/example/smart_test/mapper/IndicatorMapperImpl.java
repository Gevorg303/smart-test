package com.example.smart_test.mapper;

import com.example.smart_test.domain.Indicator;
import com.example.smart_test.dto.IndicatorDto;
import com.example.smart_test.mapper.api.IndicatorMapperInterface;
import org.springframework.stereotype.Component;

@Component
public class IndicatorMapperImpl implements IndicatorMapperInterface {
    @Override
    public IndicatorDto toDTO(Indicator entity) {
        IndicatorDto dto = new IndicatorDto();
        dto.setId(entity.getId());
        dto.setTheme(entity.getTheme());
        dto.setNameOfTheIndicator(entity.getNameOfTheIndicator());
        return dto;
    }

    @Override
    public Indicator toEntity(IndicatorDto dto) {
        Indicator entity = new Indicator();
        entity.setId(dto.getId());
        entity.setTheme(dto.getTheme());
        entity.setNameOfTheIndicator(dto.getNameOfTheIndicator());
        return entity;
    }
}
