package com.example.smart_test.controller;


import com.example.smart_test.dto.UserClassDto;
import com.example.smart_test.service.api.UserClassServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/teacherClass")
public class UserClassController {
    @Autowired
    private UserClassServiceInterface teacherClassService;

//    @PostMapping("/add")
//    public UserClassDto addTeacherClassDto(@RequestBody UserClassDto teacherClassDto) {
//        return teacherClassService.addUserClassDto(teacherClassDto);
//    }

    @DeleteMapping("/delete")
    public void deleteTeacherClassDto(@RequestBody UserClassDto teacherClassDto) {
        teacherClassService.deleteTeacherClassDto(teacherClassDto);
    }

    @GetMapping("/all")
    public List<UserClassDto> getTeacherClassDto() {
        return teacherClassService.getAllTeacherClasses();
    }

    @GetMapping("/classid={idClass}/teacherid={idTeacher}")
    public UserClassDto getAllThemesBySubjectId(@PathVariable Long idClass, @PathVariable Long idTeacher) {
        return teacherClassService.getTeacherClassByClassAndTeacher(idClass, idTeacher);
    }
}
