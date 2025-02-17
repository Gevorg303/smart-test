package com.example.smart_test.controller;

import com.example.smart_test.domain.Subject;
import com.example.smart_test.domain.Theme;
import com.example.smart_test.domain.User;
import com.example.smart_test.dto.SubjectDto;
import com.example.smart_test.dto.UserDto;
import com.example.smart_test.request.AddSubjectRequest;
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
    public SubjectDto addSubjectDto(@RequestBody AddSubjectRequest addSubjectRequest) {
        return subjectService.addSubjectDto(addSubjectRequest);
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
//    @PostMapping("/get")
//    public SubjectDto getSubjectById(@RequestBody SubjectDto subjectDto) {
//        return subjectService.getSubjectById(subjectDto.getId());
//    }

    /**
     Вывод предметов конкретного пользователя
     */
    @PostMapping("/print-user-subject")
    public List<SubjectDto> getSubjectTeacherDto(@RequestBody User user) {
        return subjectService.getSubjectByUser(user);
    }

    @PostMapping("/find-subject-by-id")
    public Subject getSubjectTeacherDto(@RequestBody Subject subject) {
        return subjectService.findSubjectById(subject.getId());
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
