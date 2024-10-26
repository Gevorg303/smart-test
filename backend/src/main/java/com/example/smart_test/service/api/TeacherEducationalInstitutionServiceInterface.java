package com.example.smart_test.service.api;

import com.example.smart_test.dto.TeacherEducationalInstitutionDto;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TeacherEducationalInstitutionServiceInterface {
    public TeacherEducationalInstitutionDto addTeacherEducationalInstitutionDto(TeacherEducationalInstitutionDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteTeacherEducationalInstitutionDto(TeacherEducationalInstitutionDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<TeacherEducationalInstitutionDto> getAllTeacherEducationalInstitutions();
}
