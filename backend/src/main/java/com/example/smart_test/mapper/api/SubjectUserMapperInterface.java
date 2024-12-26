package com.example.smart_test.mapper.api;

import com.example.smart_test.domain.SubjectTeacher;
import com.example.smart_test.dto.SubjectTeacherDto;

public interface SubjectUserMapperInterface {

    public SubjectTeacherDto toDto(SubjectTeacher entity);

    public SubjectTeacher toEntity(SubjectTeacherDto dto);
}
