package com.example.smart_test.service.api;

import com.example.smart_test.dto.StudentClassDto;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface StudentClassServiceInterface {
    StudentClassDto addStudentClassDto(StudentClassDto dto);

    void deleteStudentClassDto(StudentClassDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    List<StudentClassDto> getAllStudentClass();

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<StudentClassDto> getStudentClassByTeacherId(Long id);
}
