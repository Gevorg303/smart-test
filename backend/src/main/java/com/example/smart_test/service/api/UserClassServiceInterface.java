package com.example.smart_test.service.api;

import com.example.smart_test.domain.UserClass;
import com.example.smart_test.dto.StudentClassDto;
import com.example.smart_test.dto.UserClassDto;
import com.example.smart_test.dto.UserDto;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface UserClassServiceInterface {
    @Transactional
    UserClassDto addUserClass(UserClass userClass);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    void deleteTeacherClassDto(UserClassDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    List<UserClassDto> getAllTeacherClasses();

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    UserClassDto getTeacherClassByClassAndTeacher(Long idClass, Long idTeacher);

    List<StudentClassDto> findStudentClassByUser(UserDto userDto);
}
