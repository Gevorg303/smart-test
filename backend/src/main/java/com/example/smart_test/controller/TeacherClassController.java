package com.example.smart_test.controller;


import com.example.smart_test.dto.TeacherClassDto;
import com.example.smart_test.dto.ThemeDto;
import com.example.smart_test.service.api.TeacherClassServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/teacherClass")
public class TeacherClassController {
    @Autowired
    private TeacherClassServiceInterface teacherClassService;

    @PostMapping("/add")
    public TeacherClassDto addTeacherClassDto(@RequestBody TeacherClassDto teacherClassDto) {
        return teacherClassService.addTeacherClassDto(teacherClassDto);
    }

    @DeleteMapping("/delete")
    public void deleteTeacherClassDto(@RequestBody TeacherClassDto teacherClassDto) {
        teacherClassService.deleteTeacherClassDto(teacherClassDto);
    }

    @GetMapping("/all")
    public List<TeacherClassDto> getTeacherClassDto() {
        return teacherClassService.getAllTeacherClasses();
    }

    @GetMapping("/classid={idClass}/teacherid={idTeacher}")
    public TeacherClassDto getAllThemesBySubjectId(@PathVariable Long idClass, @PathVariable Long idTeacher) {
        return teacherClassService.getTeacherClassByClassAndTeacher(idClass, idTeacher);
    }
}
