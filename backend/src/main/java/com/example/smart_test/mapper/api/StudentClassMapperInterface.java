package com.example.smart_test.mapper.api;

import com.example.smart_test.domain.StudentClass;
import com.example.smart_test.dto.StudentClassDto;

public interface StudentClassMapperInterface {
    StudentClassDto toDTO(StudentClass entity);

    StudentClass toEntity(StudentClassDto dto);
}
