package com.example.smart_test.mapper.api;

import com.example.smart_test.domain.TeacherClass;
import com.example.smart_test.dto.TeacherClassDto;

public interface TeacherClassMapperInterface {
    public TeacherClassDto toDto(TeacherClass entity);

    public TeacherClass toEntity(TeacherClassDto dto);

}
