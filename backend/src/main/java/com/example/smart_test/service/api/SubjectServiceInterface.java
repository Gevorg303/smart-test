package com.example.smart_test.service.api;

import com.example.smart_test.domain.Theme;
import com.example.smart_test.dto.SubjectDto;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface SubjectServiceInterface {
    SubjectDto addSubjectDto(SubjectDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    void deleteSubjectDto(SubjectDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    List<SubjectDto> getAllSubject();

    SubjectDto getSubjectById(Long id);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<SubjectDto> getSubjectByLogin(String login);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<SubjectDto> getSubjectByClassAndTeacher(Long idClass, Long idTeacher);

    List<Theme> getThemesBySubjectId(Long subjectId);
}
