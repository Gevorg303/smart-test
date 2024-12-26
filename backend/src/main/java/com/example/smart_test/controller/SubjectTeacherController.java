package com.example.smart_test.controller;

import com.example.smart_test.dto.SubjectTeacherDto;
import com.example.smart_test.service.api.SubjectUserServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subject-teacher")
public class SubjectTeacherController {
    @Autowired
    private SubjectUserServiceInterface subjectService;

    @PostMapping("/add")
    public SubjectTeacherDto addSubjectTeacherDto(@RequestBody SubjectTeacherDto subjectDto) {
        return subjectService.addSubjectTeacherDto(subjectDto);
    }

    @DeleteMapping("/delete")
    public void deleteSubjectTeacherDto(@RequestBody SubjectTeacherDto subjectDto) {
        subjectService.deleteSubjectTeacherDto(subjectDto);
    }

    @GetMapping("/all")
    public List<SubjectTeacherDto> getSubjectTeacherDto() {
        return subjectService.getAllSubjectTeachers();
    }
}
