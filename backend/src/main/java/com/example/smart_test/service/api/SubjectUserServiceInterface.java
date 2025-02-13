package com.example.smart_test.service.api;


import com.example.smart_test.domain.SubjectUser;
import com.example.smart_test.domain.User;
import com.example.smart_test.dto.SubjectDto;
import com.example.smart_test.dto.SubjectUserDto;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface SubjectUserServiceInterface {
    SubjectUserDto addSubjectTeacherDto(SubjectUserDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    void deleteSubjectUserDto(SubjectDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    List<SubjectUserDto> getAllSubjectTeachers();

    @Transactional
    List<SubjectUser> findByUserId(User user);
}
