package com.example.smart_test.controller;


import com.example.smart_test.dto.UserEducationalInstitutionDto;
import com.example.smart_test.service.api.UserEducationalInstitutionServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("TeacherEducationalInstitution")
public class UserEducationalInstitutionController {
    @Autowired
    private UserEducationalInstitutionServiceInterface teacherEducationalInstitutionService;

//    @PostMapping("/add")
//    public UserEducationalInstitutionDto addTeacherEducationalInstitutionDto(@RequestBody UserEducationalInstitutionDto teacherEducationalInstitutionDto) {
//        return teacherEducationalInstitutionService.addTeacherEducationalInstitutionDto(teacherEducationalInstitutionDto);
//    }

    @DeleteMapping("/delete")
    public void deleteTeacherEducationalInstitutionDto(@RequestBody UserEducationalInstitutionDto teacherEducationalInstitutionDto) {
        teacherEducationalInstitutionService.deleteTeacherEducationalInstitutionDto(teacherEducationalInstitutionDto);
    }

    @GetMapping("/all")
    public List<UserEducationalInstitutionDto> getTeacherEducationalInstitutionDto() {
        return teacherEducationalInstitutionService.getAllTeacherEducationalInstitutions();
    }
}
