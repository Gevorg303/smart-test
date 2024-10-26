package com.example.smart_test.service.api;

import com.example.smart_test.dto.TeacherClassDto;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TeacherClassServiceInterface {
    public TeacherClassDto addTeacherClassDto(TeacherClassDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteTeacherClassDto(TeacherClassDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<TeacherClassDto> getAllTeacherClasses();

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public TeacherClassDto getTeacherClassByClassAndTeacher(Long idClass, Long idTeacher);
}
