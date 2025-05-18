package com.example.smart_test.service.api;


import com.example.smart_test.domain.StudentClass;
import com.example.smart_test.domain.Subject;
import com.example.smart_test.domain.SubjectUser;
import com.example.smart_test.domain.User;
import com.example.smart_test.dto.StudentClassDto;
import com.example.smart_test.dto.SubjectDto;
import com.example.smart_test.dto.SubjectUserDto;
import com.example.smart_test.dto.UserDto;
import com.example.smart_test.request.ClassStatusResponse;
import com.example.smart_test.request.SubjectClassRequest;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

public interface SubjectUserServiceInterface {
    void addSubjectUserDto(SubjectClassRequest request);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    void deleteSubjectUserDto(SubjectDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    List<SubjectUserDto> getAllSubjectTeachers();

    @Transactional
    List<SubjectUser> findByUserId(UserDto user);

    @Transactional
    Set<SubjectDto> getSubjectsByUsers(List<User> users);

    Set<ClassStatusResponse> findClassBySubject(SubjectDto dto);

    void removeSubjectUserDto(SubjectClassRequest request);

    List<UserDto> getUsersBySubject(SubjectDto subject);

    Set<User> getUsersByClass(StudentClass studentClass);
}
