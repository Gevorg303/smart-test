package com.example.smart_test.controller;


import com.example.smart_test.dto.TeacherEducationalInstitutionDto;
import com.example.smart_test.service.api.TeacherEducationalInstitutionServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("TeacherEducationalInstitution")
public class TeacherEducationalInstitutionController {
    @Autowired
    private TeacherEducationalInstitutionServiceInterface teacherEducationalInstitutionService;

    @PostMapping("/add")
    public TeacherEducationalInstitutionDto addTeacherEducationalInstitutionDto(@RequestBody TeacherEducationalInstitutionDto teacherEducationalInstitutionDto) {
        return teacherEducationalInstitutionService.addTeacherEducationalInstitutionDto(teacherEducationalInstitutionDto);
    }

    @DeleteMapping("/delete")
    public void deleteTeacherEducationalInstitutionDto(@RequestBody TeacherEducationalInstitutionDto teacherEducationalInstitutionDto) {
        teacherEducationalInstitutionService.deleteTeacherEducationalInstitutionDto(teacherEducationalInstitutionDto);
    }

    @GetMapping("/all")
    public List<TeacherEducationalInstitutionDto> getTeacherEducationalInstitutionDto() {
        return teacherEducationalInstitutionService.getAllTeacherEducationalInstitutions();
    }
}
