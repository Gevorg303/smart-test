package com.example.smart_test.service.api;

import com.example.smart_test.domain.StudentClass;
import com.example.smart_test.domain.UserEducationalInstitution;
import com.example.smart_test.dto.UserDto;
import com.example.smart_test.dto.UserEducationalInstitutionDto;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface UserEducationalInstitutionServiceInterface {
    @Transactional
    List<StudentClass> findUserEducationalInstitutionByUser(UserDto userDto);

    @Transactional
    UserEducationalInstitutionDto addUserEducationalInstitution(UserEducationalInstitution userEducationalInstitution);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    void deleteTeacherEducationalInstitutionDto(UserEducationalInstitutionDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    List<UserEducationalInstitutionDto> getAllTeacherEducationalInstitutions();
}
