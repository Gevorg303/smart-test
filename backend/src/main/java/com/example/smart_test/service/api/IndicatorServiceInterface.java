package com.example.smart_test.service.api;

import com.example.smart_test.dto.IndicatorDto;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface IndicatorServiceInterface {
    public IndicatorDto addIndicatorDto(IndicatorDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteIndicatorDto(IndicatorDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<IndicatorDto> getAllIndicators();
}
