package com.example.smart_test.service.api;


import com.example.smart_test.dto.SubjectTeacherDto;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface SubjectTeacherServiceInterface {
    SubjectTeacherDto addSubjectTeacherDto(SubjectTeacherDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    void deleteSubjectTeacherDto(SubjectTeacherDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    List<SubjectTeacherDto> getAllSubjectTeachers();
}
