package com.example.smart_test.controller;

import com.example.smart_test.domain.Subject;
import com.example.smart_test.domain.Theme;
import com.example.smart_test.domain.User;
import com.example.smart_test.dto.SubjectDto;
import com.example.smart_test.dto.ThemeDto;
import com.example.smart_test.dto.UserDto;
import com.example.smart_test.service.api.ThemeServiceInterface;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/theme")
@Tag(name = "Theme Controller", description = "API для управления темами")
public class ThemeController {
    @Autowired
    private ThemeServiceInterface themeService;

    @Operation(summary = "Добавить тему", description = "Добавляет новую тему в систему")
    @ApiResponse(responseCode = "200", description = "Тема успешно добавлена",
            content = @Content(schema = @Schema(implementation = ThemeDto.class)))
    @PostMapping("/add")
    public ThemeDto addTheme(@RequestBody ThemeDto themeDto) {
        return themeService.addThemeDto(themeDto);
    }

    @Operation(summary = "Удалить тему", description = "Удаляет указанную тему из системы")
    @ApiResponse(responseCode = "200", description = "Тема успешно удалена")
    @DeleteMapping("/delete")
    public void deleteTheme(@RequestBody ThemeDto themeDto) {
        themeService.deleteIndicatorsAndTasks(themeDto);
    }

    @Operation(summary = "Получить все темы", description = "Возвращает список всех тем")
    @ApiResponse(responseCode = "200", description = "Список тем успешно получен",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = ThemeDto.class))))
    @GetMapping("/all")
    public List<ThemeDto> getAllTheme() {
        return themeService.getAllTheme();
    }

    @Operation(summary = "Найти темы по идентификатору предмета", description = "Возвращает список тем, связанных с указанным предметом")
    @ApiResponse(responseCode = "200", description = "Список тем успешно получен",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = Theme.class))))
    @GetMapping("/find-theme-by-id-subject")
    public List<Theme> findThemeByIdSubject(@RequestBody SubjectDto subject) {
        return themeService.findThemeByIdSubject(subject);
    }

    @Operation(summary = "Получить темы по идентификатору предмета", description = "Возвращает список тем, связанных с указанным предметом")
    @ApiResponse(responseCode = "200", description = "Список тем успешно получен",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = Theme.class))))
    @PostMapping("/get-by-subject")
    public List<Theme> getAllThemesBySubjectIdNoCookie(@RequestBody SubjectDto subject) {
        return themeService.findThemeByIdSubject(subject);
    }

    @Operation(summary = "Получить тему по идентификатору", description = "Возвращает тему по указанному идентификатору")
    @ApiResponse(responseCode = "200", description = "Тема успешно получена",
            content = @Content(schema = @Schema(implementation = ThemeDto.class)))
    @GetMapping("/id:{id}")
    public ThemeDto getThemById(@PathVariable Long id) {
        return themeService.getThemeById(id);
    }

    @Operation(summary = "Получить темы пользователя", description = "Возвращает список тем, связанных с указанным пользователем")
    @ApiResponse(responseCode = "200", description = "Список тем успешно получен",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = ThemeDto.class))))
    @PostMapping("/get-theme-by-id-user")
    public List<ThemeDto> getThemeByIdUser(@RequestBody UserDto user){
        return themeService.getUserThemes(user);
    }

    @Operation(summary = "Обновить тему", description = "Обновляет информацию о теме")
    @ApiResponse(responseCode = "200", description = "Тема успешно обновлена",
            content = @Content(schema = @Schema(implementation = Theme.class)))
    @PutMapping("/update-theme")
    public ResponseEntity<Theme> updateTheme(@RequestBody Theme updatedTheme) {
        Theme theme = themeService.updateTheme(updatedTheme);
        return ResponseEntity.ok(theme);
    }

}
