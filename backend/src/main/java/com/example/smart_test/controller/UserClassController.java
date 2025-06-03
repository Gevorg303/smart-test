package com.example.smart_test.controller;


import com.example.smart_test.dto.StudentClassDto;
import com.example.smart_test.dto.UserClassDto;
import com.example.smart_test.dto.UserDto;
import com.example.smart_test.service.api.UserClassServiceInterface;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/teacherClass")
@Tag(name = "User Class Controller", description = "API для управления связями пользователь-класс")
public class UserClassController {
    @Autowired
    private UserClassServiceInterface teacherClassService;

    @DeleteMapping("/delete")
    public void deleteTeacherClassDto(@RequestBody UserClassDto teacherClassDto) {
        teacherClassService.deleteUserClassDto(teacherClassDto);
    }

    @GetMapping("/all")
    public List<UserClassDto> getTeacherClassDto() {
        return teacherClassService.getAllTeacherClasses();
    }

    @GetMapping("/classid={idClass}/teacherid={idTeacher}")
    public UserClassDto getAllThemesBySubjectId(@PathVariable Long idClass, @PathVariable Long idTeacher) {
        return teacherClassService.getTeacherClassByClassAndTeacher(idClass, idTeacher);
    }

    @PostMapping("/find-user-by-class")
    public List<UserDto> findUserByClass(@RequestBody StudentClassDto studentClassDto) {
        return teacherClassService.findUserByClass(studentClassDto);
    }
}
