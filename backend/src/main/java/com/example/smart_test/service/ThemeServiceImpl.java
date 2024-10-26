package com.example.smart_test.service;


import com.example.smart_test.domain.Subject;
import com.example.smart_test.domain.Theme;
import com.example.smart_test.dto.SubjectDto;
import com.example.smart_test.dto.ThemeDto;
import com.example.smart_test.mapper.api.ThemeMapperInterface;
import com.example.smart_test.repository.ThemeRepositoryInterface;
import com.example.smart_test.service.api.ThemeServiceInterface;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ThemeServiceImpl implements ThemeServiceInterface {
    @Autowired
    private ThemeRepositoryInterface themeRepository;
    @Autowired
    private ThemeMapperInterface themeMapper;

    @Override
    public ThemeDto addThemeDto(ThemeDto dto) {
        try {
            Theme theme = themeMapper.toEntity(dto);
            theme = themeRepository.save(theme);
            return themeMapper.toDTO(theme);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при добавлении темы: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteThemeDto(ThemeDto dto) {
        if (findThemeById(dto.getId())) {
            Theme theme = themeMapper.toEntity(dto);
            themeRepository.delete(theme);
        } else {
            log.error("Класс с идентификатором " + dto.getId() + " не существует");
        }
    }

    @Override
    public List<ThemeDto> getAllTheme() {
        try {
            List<Theme> institutions = themeRepository.findAll();
            return institutions.stream()
                    .map(themeMapper::toDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при получении всех тем: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean findThemeById(Long id) {
        Optional<Theme> theme = themeRepository.findById(id);
        return theme.isPresent();
    }

    @Override
    public ThemeDto getThemeById(Long id) {
        try {
            Theme theme = themeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Предмет не найден"));
            return themeMapper.toDTO(theme);
        } catch (Exception e) {
            throw new RuntimeException("Не удалось получить предмет: " + e.getMessage(), e);
        }
    }

    @Override
    public List<ThemeDto> getThemeBySubjectId(Long id) {
        try {
            List<Theme> subjects = themeRepository.findBySubjectId(id);
            List<ThemeDto> subjectDto = new ArrayList<>();
            for (Theme subject : subjects) {
                subjectDto.add(themeMapper.toDTO(subject));
            }
            return subjectDto;
        } catch (Exception e) {
            throw new RuntimeException("Не удалось получить предмет: " + e.getMessage(), e);
        }

    }
}
