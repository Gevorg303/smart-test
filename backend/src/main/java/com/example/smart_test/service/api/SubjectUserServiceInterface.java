package com.example.smart_test.service.api;


import com.example.smart_test.dto.SubjectUserDto;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface SubjectUserServiceInterface {
    SubjectUserDto addSubjectTeacherDto(SubjectUserDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    void deleteSubjectTeacherDto(SubjectUserDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    List<SubjectUserDto> getAllSubjectTeachers();
}
