package com.example.smart_test.controller;

import com.example.smart_test.domain.Theme;
import com.example.smart_test.dto.SubjectDto;
import com.example.smart_test.dto.SubjectTeacherDto;
import com.example.smart_test.repository.SubjectRepositoryInterface;
import com.example.smart_test.service.api.SubjectServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subject")
public class SubjectController {
    @Autowired
    private SubjectServiceInterface subjectService;

    @PostMapping("/add")
    public SubjectDto addSubjectDto(@RequestBody SubjectDto subjectDto) {
        return subjectService.addSubjectDto(subjectDto);
    }

    @DeleteMapping("/delete")
    public void deleteSubjectDto(@RequestBody SubjectDto subjectDto) {
        subjectService.deleteSubjectDto(subjectDto);
    }

    @GetMapping("/all")
    public List<SubjectDto> getSubjectDto() {
        return subjectService.getAllSubject();
    }

    /*Вывод информации про конкретный предмет*/
    @PostMapping("/get")
    public SubjectDto getSubjectById(@RequestBody SubjectDto subjectDto) {
        return subjectService.getSubjectById(subjectDto.getId());
    }

    @GetMapping("/{login}")
    public List<SubjectDto> getSubjectTeacherDto(@PathVariable String login) {
        return subjectService.getSubjectByLogin(login);
    }

    @GetMapping("/id:{id}")
    public SubjectDto getSubjectTeacherDto(@PathVariable Long id) {
        return subjectService.getSubjectById(id);
    }

    @GetMapping("/class={idClass}/teacher={idTeacher}")
    public List<SubjectDto> getSubjectByClassAndTeacher(@PathVariable Long idClass, @PathVariable Long idTeacher) {
        return subjectService.getSubjectByClassAndTeacher(idClass, idTeacher);
    }

    @GetMapping("/{subjectId}/themes")
    public ResponseEntity<List<Theme>> getThemesBySubjectId(@PathVariable Long subjectId) {
        List<Theme> themes = subjectService.getThemesBySubjectId(subjectId);
        return new ResponseEntity<>(themes, HttpStatus.OK);
    }
}
