package com.example.smart_test.service.api;

import com.example.smart_test.dto.EducationalInstitutionDto;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface EducationalInstitutionServiceInterface {
    EducationalInstitutionDto addEducationalInstitutionDto(EducationalInstitutionDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    void deleteEducationalInstitutionDto(EducationalInstitutionDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    List<EducationalInstitutionDto> getAllEducationalInstitutions();
}
