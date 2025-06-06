package com.example.smart_test.service.api;

import com.example.smart_test.domain.Indicator;
import com.example.smart_test.domain.Theme;
import com.example.smart_test.domain.User;
import com.example.smart_test.dto.IndicatorDto;
import com.example.smart_test.dto.UserDto;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface IndicatorServiceInterface {
    IndicatorDto addIndicatorDto(IndicatorDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    void deleteIndicatorDto(IndicatorDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    List<IndicatorDto> getAllIndicators();

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    List<IndicatorDto> getIndicatorsByTheme(Theme theme);

    @Transactional
    List<Indicator> findIndicatorByIdTheme(Theme theme);

    @Transactional
    List<IndicatorDto> getUserIndicators(UserDto dto);

    Indicator updateIndicator(IndicatorDto updatedIndicator);

    void deleteByThemeId(Long idTheme);

    void deleteByIndicatorId(Long idIndicator);
}
