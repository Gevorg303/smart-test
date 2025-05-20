package com.example.smart_test.controller;

import com.example.smart_test.request.EditingTaskRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.smart_test.domain.StudentClass;
import com.example.smart_test.dto.EducationalInstitutionDto;
import com.example.smart_test.dto.StudentClassDto;
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

    /**
     * Метод для получения классов в конкретной школе
     * */
    @PostMapping("/find-class-by-educational-institution")
    public List<StudentClass> findClassByEducationalInstitution(@RequestBody EducationalInstitutionDto educationalInstitution) {
        return serviceInterface.findClassByEducationalInstitution(educationalInstitution);
    }

    @GetMapping("/teacherid={id}")
    public List<StudentClassDto> getAllStudentClassByTeacherId(@PathVariable Long id) {
        return serviceInterface.getStudentClassByUserId(id);
    }

    /**
     * Запрос для редактирования класса
     * */
    @PutMapping("/update-class")
    public void updateClass(@RequestBody StudentClassDto studentClassDto) {
        serviceInterface.updateClass(studentClassDto);
    }
}
