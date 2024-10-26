package com.example.smart_test.controller;

import com.example.smart_test.dto.ThemeDto;
import com.example.smart_test.service.api.ThemeServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/theme")
public class ThemeController {
    @Autowired
    private ThemeServiceInterface themeService;

    @PostMapping("/add")
    public ThemeDto addTheme(@RequestBody ThemeDto themeDto) {
        return themeService.addThemeDto(themeDto);
    }

    @DeleteMapping("/delete")
    public void deleteTheme(@RequestBody ThemeDto themeDto) {
        themeService.deleteThemeDto(themeDto);
    }

    @GetMapping("/all")
    public List<ThemeDto> getAllTheme() {
        return themeService.getAllTheme();
    }

    @GetMapping("/getbysubject")
    public List<ThemeDto> getAllThemesBySubjectId(@CookieValue("sub") Long id) {
        return themeService.getThemeBySubjectId(id);
    }

    @GetMapping("/id:{id}")
    public ThemeDto getThemById(@PathVariable Long id) {
        return themeService.getThemeById(id);
    }
}
