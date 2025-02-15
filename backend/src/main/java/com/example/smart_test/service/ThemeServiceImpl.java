package com.example.smart_test.service;


import com.example.smart_test.domain.Subject;
import com.example.smart_test.domain.Theme;
import com.example.smart_test.domain.User;
import com.example.smart_test.dto.SubjectUserDto;
import com.example.smart_test.dto.ThemeDto;
import com.example.smart_test.dto.UserDto;
import com.example.smart_test.mapper.api.ThemeMapperInterface;
import com.example.smart_test.repository.ThemeRepositoryInterface;
import com.example.smart_test.service.api.SubjectUserServiceInterface;
import com.example.smart_test.service.api.ThemeServiceInterface;
import com.example.smart_test.service.api.UserServiceInterface;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ThemeServiceImpl implements ThemeServiceInterface {
    @Autowired
    private ThemeRepositoryInterface themeRepository;
    @Autowired
    private ThemeMapperInterface themeMapper;
    @Autowired
    private UserServiceInterface userService;
    @Autowired
    private SubjectUserServiceInterface subjectUserService;

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
            log.error("Тема с идентификатором " + dto.getId() + " не существует");
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
                    .orElseThrow(() -> new RuntimeException("Тема не найдена"));
            return themeMapper.toDTO(theme);
        } catch (Exception e) {
            throw new RuntimeException("Не удалось получить тему: " + e.getMessage(), e);
        }
    }

    @Override
    public List<Theme> findThemeByIdSubject(@NotNull Subject subject) {
       return themeRepository.findBySubjectId(subject.getId());
    }

    @Transactional
    @Override
    public List<ThemeDto> getUserThemes(User dto) {
        UserDto userDto = userService.getUserByLogin(dto);
        if (userDto == null) {
            throw new IllegalArgumentException("User not found");
        }

        List<SubjectUserDto> subjectTeachers = subjectUserService.getAllSubjectTeachers()
                .stream()
                .filter(st -> st.getUser() != null && st.getUser().getId().equals(userDto.getId()))
                .toList();

        List<ThemeDto> allThemes = getAllTheme();

        Set<ThemeDto> userThemes = subjectTeachers.stream()
                .flatMap(subjectTeacher -> allThemes.stream()
                        .filter(theme -> theme.getSubject() != null && theme.getSubject().getId().equals(subjectTeacher.getSubject().getId()))
                )
                .collect(Collectors.toSet());

        return new ArrayList<>(userThemes);
    }

}
