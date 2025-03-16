package com.example.smart_test.service.api;

import com.example.smart_test.domain.Subject;
import com.example.smart_test.domain.Theme;
import com.example.smart_test.domain.User;
import com.example.smart_test.dto.SubjectDto;
import com.example.smart_test.request.AddSubjectRequest;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface SubjectServiceInterface {
    SubjectDto addSubjectDto(AddSubjectRequest dto);

    @Transactional
    List<SubjectDto> getSubjectByUser(User user);

    Subject findSubjectById(Long id);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    void deleteSubjectDto(SubjectDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    List<SubjectDto> getAllSubject();

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    List<SubjectDto> getSubjectByClassAndTeacher(Long idClass, Long idTeacher);

    List<Theme> getThemesBySubjectId(Long subjectId);

    Subject updateSubject(Subject updatedSubject);
}
