package com.example.smart_test.mapper.api;

import com.example.smart_test.domain.Indicator;
import com.example.smart_test.dto.IndicatorDto;

public interface IndicatorMapperInterface {
    public IndicatorDto toDTO(Indicator entity);

    public Indicator toEntity(IndicatorDto dto);
}
