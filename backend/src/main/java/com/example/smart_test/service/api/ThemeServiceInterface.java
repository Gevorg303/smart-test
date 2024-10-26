package com.example.smart_test.service.api;

import com.example.smart_test.dto.ThemeDto;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ThemeServiceInterface {
    ThemeDto addThemeDto(ThemeDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    void deleteThemeDto(ThemeDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    List<ThemeDto> getAllTheme();

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<ThemeDto> getThemeBySubjectId(Long id);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public boolean findThemeById(Long id);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public ThemeDto getThemeById(Long id);
}
