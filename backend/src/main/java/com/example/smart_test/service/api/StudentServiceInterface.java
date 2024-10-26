package com.example.smart_test.service.api;

import com.example.smart_test.dto.UserDto;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface StudentServiceInterface {
    UserDto addStudentDto(UserDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    void deleteStudentDto(UserDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    List<UserDto> getAllStudent();

    UserDto getStudentByLogin(UserDto dto);

    Boolean checkPasswordByLogin(UserDto dto);
}
