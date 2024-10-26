package com.example.smart_test.service.api;

import com.example.smart_test.dto.UserDto;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TeacherServiceInterface {
    UserDto addTeacherDto(UserDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteTeacherDto(UserDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<UserDto> getAllTeachers();

    UserDto getTeacherByLogin(UserDto dto);

    Boolean checkPasswordByLogin(UserDto dto);
}
