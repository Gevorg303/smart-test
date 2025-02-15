package com.example.smart_test.controller;

import com.example.smart_test.domain.Subject;
import com.example.smart_test.domain.Theme;
import com.example.smart_test.domain.User;
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

    /**
     * Метод выводит все темы по предмету
     * */
    @GetMapping("/find-theme-by-id-subject")
    public List<Theme> findThemeByIdSubject(@RequestBody Subject subject) {
        return themeService.findThemeByIdSubject(subject);
    }
    @GetMapping("/getbysubject:{id}")//сервер не может прочитать куки созданные на фронте
    public List<Theme> getAllThemesBySubjectIdNoCookie(/*@CookieValue("sub")*/@RequestBody Subject subject) {
        return themeService.findThemeByIdSubject(subject);
    }

    @GetMapping("/id:{id}")
    public ThemeDto getThemById(@PathVariable Long id) {
        return themeService.getThemeById(id);
    }

    /**
     * Метод для вывода тем пользователя
     * */
    @GetMapping("/get-theme-by-id-user")
    public List<ThemeDto> getThemeByIdUser(@RequestBody User user){
        return themeService.getUserThemes(user);
    }
}
