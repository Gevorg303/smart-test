package com.example.smart_test.service.api;

import com.example.smart_test.domain.EducationalInstitution;
import com.example.smart_test.domain.StudentClass;
import com.example.smart_test.dto.EducationalInstitutionDto;
import com.example.smart_test.dto.StudentClassDto;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface StudentClassServiceInterface {
    @Transactional
    List<StudentClass> findClassByEducationalInstitution (EducationalInstitutionDto educationalInstitutionDto);

    @Transactional
    StudentClassDto addStudentClassDto(StudentClassDto dto);

    void deleteStudentClassDto(StudentClassDto dto);

    @Transactional
    List<StudentClassDto> getStudentClassByUserId(Long id);

    @Transactional
    void incrementClassNumbers();
}
