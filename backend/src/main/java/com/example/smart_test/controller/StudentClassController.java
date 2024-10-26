package com.example.smart_test.controller;

import com.example.smart_test.dto.StudentClassDto;
import com.example.smart_test.dto.TeacherClassDto;
import com.example.smart_test.service.api.StudentClassServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/student-class")
public class StudentClassController {
    @Autowired
    private StudentClassServiceInterface serviceInterface;

    @PostMapping("/add")
    public StudentClassDto addStudentClass(@RequestBody StudentClassDto dto) {
        return serviceInterface.addStudentClassDto(dto);
    }

    @DeleteMapping("/delete")
    public void deleteStudentClass(@RequestBody StudentClassDto dto) {
        serviceInterface.deleteStudentClassDto(dto);
    }

    @GetMapping("/all")
    public List<StudentClassDto> getAllStudentClass() {
        return serviceInterface.getAllStudentClass();
    }

    @GetMapping("/teacherid={id}")
    public List<StudentClassDto> getAllStudentClassByTeacherId(@PathVariable Long id) {
        return serviceInterface.getStudentClassByTeacherId(id);
    }
}
