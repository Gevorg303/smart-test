package com.example.smart_test.service;


import com.example.smart_test.domain.Indicator;
import com.example.smart_test.dto.IndicatorDto;
import com.example.smart_test.mapper.api.IndicatorMapperInterface;
import com.example.smart_test.repository.IndicatorRepositoryInterface;
import com.example.smart_test.service.api.IndicatorServiceInterface;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class IndicatorServiceImpl implements IndicatorServiceInterface {

    @Autowired
    private IndicatorRepositoryInterface indicatorRepositoryInterface;
    @Autowired
    private IndicatorMapperInterface indicatorMapperInterface;

    @Override
    public IndicatorDto addIndicatorDto(IndicatorDto dto) {
        try {
            Indicator indicator = indicatorMapperInterface.toEntity(dto);
            indicator = indicatorRepositoryInterface.save(indicator);
            return indicatorMapperInterface.toDTO(indicator);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при добавлении индикатора: " + e.getMessage(), e);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteIndicatorDto(IndicatorDto dto) {
        if (findIndicatorById(dto.getId())) {
            Indicator indicator = indicatorMapperInterface.toEntity(dto);
            indicatorRepositoryInterface.delete(indicator);
        } else {
            log.error("Индикатор с идентификатором " + dto.getId() + " не существует");
        }
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<IndicatorDto> getAllIndicators() {
        try {
            List<Indicator> indicators = indicatorRepositoryInterface.findAll();
            return indicators.stream()
                    .map(indicatorMapperInterface::toDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при получении всех индикаторов: " + e.getMessage(), e);
        }
    }

    private boolean findIndicatorById(Long id) {
        Optional<Indicator> indicator = indicatorRepositoryInterface.findById(id);
        return indicator.isPresent();
    }
}
