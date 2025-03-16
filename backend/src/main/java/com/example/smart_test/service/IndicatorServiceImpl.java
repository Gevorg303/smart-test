package com.example.smart_test.service;


import com.example.smart_test.domain.Indicator;
import com.example.smart_test.domain.Theme;
import com.example.smart_test.domain.User;
import com.example.smart_test.dto.*;
import com.example.smart_test.mapper.api.IndicatorMapperInterface;
import com.example.smart_test.repository.IndicatorRepositoryInterface;
import com.example.smart_test.service.api.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class IndicatorServiceImpl implements IndicatorServiceInterface {

    @Autowired
    private UserServiceInterface userService;
    @Autowired
    private SubjectUserServiceInterface subjectUserService;
    @Autowired
    private ThemeServiceInterface themeService;
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

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<IndicatorDto> getIndicatorsByTheme(Theme theme) {
        try {
            List<Indicator> indicators = indicatorRepositoryInterface.findByTheme(theme);
            return indicators.stream()
                    .map(indicatorMapperInterface::toDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при получении индикаторов по теме: " + e.getMessage(), e);
        }
    }

    private boolean findIndicatorById(Long id) {
        Optional<Indicator> indicator = indicatorRepositoryInterface.findById(id);
        return indicator.isPresent();
    }

    @Transactional
    @Override
    public List<Indicator> findIndicatorByIdTheme(Theme theme) {
        return indicatorRepositoryInterface.findByTheme(theme);
    }

    @Transactional
    @Override
    public List<IndicatorDto> getUserIndicators(User dto) {
        UserDto userDto = userService.getUserByLogin(dto);
        if (userDto == null) {
            throw new IllegalArgumentException("User not found");
        }

        List<SubjectUserDto> subjectTeachers = subjectUserService.getAllSubjectTeachers()
                .stream()
                .filter(st -> st.getUser() != null && st.getUser().getId().equals(userDto.getId()))
                .toList();

        List<ThemeDto> themes = themeService.getAllTheme();
        List<IndicatorDto> indicatorDtoList = getAllIndicators();

        Set<IndicatorDto> uniqueIndicators = new HashSet<>();

        subjectTeachers.stream()
                .flatMap(subjectTeacher -> themes.stream()
                        .filter(theme -> theme.getSubject() != null && theme.getSubject().getId().equals(subjectTeacher.getSubject().getId()))
                        .flatMap(theme -> indicatorDtoList.stream()
                                .filter(indicator -> indicator.getTheme() != null && indicator.getTheme().getId().equals(theme.getId()))
                        )
                )
                .forEach(uniqueIndicators::add);

        return new ArrayList<>(uniqueIndicators);
    }

    @Override
    public Indicator updateIndicator(Indicator updatedIndicator) {
        return indicatorRepositoryInterface.findById(updatedIndicator.getId())
                .map(indicator -> {
                    indicator.setTheme(updatedIndicator.getTheme());
                    indicator.setNameOfTheIndicator(updatedIndicator.getNameOfTheIndicator());
                    return indicatorRepositoryInterface.save(indicator);
                })
                .orElseThrow(() -> new EntityNotFoundException("Индикатор с ID " + updatedIndicator.getId() + " не найден"));
    }

}
