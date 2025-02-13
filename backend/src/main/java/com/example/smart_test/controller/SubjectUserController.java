package com.example.smart_test.controller;

import com.example.smart_test.dto.SubjectUserDto;
import com.example.smart_test.service.api.SubjectUserServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subject-teacher")
public class SubjectUserController {
    @Autowired
    private SubjectUserServiceInterface subjectService;

//    @PostMapping("/add")
//    public SubjectUserDto addSubjectTeacherDto(@RequestBody SubjectUserDto subjectDto) {
//        return subjectService.addSubjectTeacherDto(subjectDto);
//    }
//
//    @DeleteMapping("/delete")
//    public void deleteSubjectTeacherDto(@RequestBody SubjectUserDto subjectDto) {
//        subjectService.deleteSubjectUserDto(subjectDto);
//    }
//
//    @GetMapping("/all")
//    public List<SubjectUserDto> getSubjectTeacherDto() {
//        return subjectService.getAllSubjectTeachers();
//    }
}
