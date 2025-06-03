package com.example.smart_test.controller;

import com.example.smart_test.domain.Subject;
import com.example.smart_test.domain.Theme;
import com.example.smart_test.domain.User;
import com.example.smart_test.dto.SubjectDto;
import com.example.smart_test.dto.UserDto;
import com.example.smart_test.request.AddSubjectRequest;
import com.example.smart_test.service.api.SubjectServiceInterface;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/subject")
@Tag(name = "Subject Controller", description = "API для управления предметами")
public class SubjectController {
    @Autowired
    private SubjectServiceInterface subjectService;

    @Operation(summary = "Добавить предмет", description = "Добавляет новый предмет в систему")
    @ApiResponse(responseCode = "200", description = "Предмет успешно добавлен",
            content = @Content(schema = @Schema(implementation = SubjectDto.class)))
    @PostMapping("/add")
    public SubjectDto addSubjectDto(@RequestBody AddSubjectRequest addSubjectRequest) {
        return subjectService.addSubjectDto(addSubjectRequest);
    }

    @Operation(summary = "Удалить предмет", description = "Удаляет указанный предмет из системы")
    @ApiResponse(responseCode = "200", description = "Предмет успешно удален")
    @DeleteMapping("/delete")
    public void deleteSubjectDto(@RequestBody SubjectDto subjectDto) {
        subjectService.deleteSubjectDto(subjectDto);
    }

    @Operation(summary = "Получить все предметы", description = "Возвращает список всех предметов")
    @ApiResponse(responseCode = "200", description = "Список предметов успешно получен",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = SubjectDto.class))))
    @GetMapping("/all")
    public List<SubjectDto> getSubjectDto() {
        return subjectService.getAllSubject();
    }

    @Operation(summary = "Получить предметы пользователя", description = "Возвращает список предметов, связанных с указанным пользователем")
    @ApiResponse(responseCode = "200", description = "Список предметов пользователя успешно получен",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = SubjectDto.class))))
    @PostMapping("/print-user-subject")
    public Set<SubjectDto> getSubjectTeacherDto(@RequestBody UserDto user) {
        return subjectService.getSubjectByUser(user);
    }

    @Operation(summary = "Найти предмет по идентификатору", description = "Возвращает предмет по указанному идентификатору")
    @ApiResponse(responseCode = "200", description = "Предмет успешно найден",
            content = @Content(schema = @Schema(implementation = Subject.class)))
    @PostMapping("/find-subject-by-id")
    public Subject getSubjectTeacherDto(@RequestBody Subject subject) {
        return subjectService.findSubjectById(subject.getId());
    }

    @Operation(summary = "Получить предметы по классу и учителю", description = "Возвращает список предметов, связанных с указанным классом и учителем")
    @ApiResponse(responseCode = "200", description = "Список предметов успешно получен",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = SubjectDto.class))))
    @GetMapping("/class={idClass}/teacher={idTeacher}")
    public List<SubjectDto> getSubjectByClassAndTeacher(@PathVariable Long idClass, @PathVariable Long idTeacher) {
        return subjectService.getSubjectByClassAndTeacher(idClass, idTeacher);
    }

    @Operation(summary = "Получить темы по идентификатору предмета", description = "Возвращает список тем, связанных с указанным предметом")
    @ApiResponse(responseCode = "200", description = "Список тем успешно получен",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = Theme.class))))
    @GetMapping("/{subjectId}/themes")
    public ResponseEntity<List<Theme>> getThemesBySubjectId(@PathVariable Long subjectId) {
        List<Theme> themes = subjectService.getThemesBySubjectId(subjectId);
        return new ResponseEntity<>(themes, HttpStatus.OK);
    }

    @Operation(summary = "Обновить предмет", description = "Обновляет информацию о предмете")
    @ApiResponse(responseCode = "200", description = "Предмет успешно обновлен",
            content = @Content(schema = @Schema(implementation = Subject.class)))
    @PutMapping("/update-subject")
    public ResponseEntity<Subject> updateSubject(@RequestBody Subject updatedSubject) {
        Subject subject = subjectService.updateSubject(updatedSubject);
        return ResponseEntity.ok(subject);
    }
}
