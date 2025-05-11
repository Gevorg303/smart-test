package com.example.smart_test.service.api;

import com.example.smart_test.domain.Subject;
import com.example.smart_test.domain.Theme;
import com.example.smart_test.domain.User;
import com.example.smart_test.dto.SubjectDto;
import com.example.smart_test.dto.ThemeDto;
import com.example.smart_test.dto.UserDto;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ThemeServiceInterface {
    ThemeDto addThemeDto(ThemeDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    void deleteThemeDto(ThemeDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    List<ThemeDto> getAllTheme();

    List<Theme> findThemeByIdSubject(SubjectDto subject);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    boolean findThemeById(Long id);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    ThemeDto getThemeById(Long id);

    @Transactional
    List<ThemeDto> getUserThemes(UserDto dto);

    Theme updateTheme(Theme updatedTheme);
}
