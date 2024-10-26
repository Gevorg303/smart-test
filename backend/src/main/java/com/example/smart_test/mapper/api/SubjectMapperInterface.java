package com.example.smart_test.mapper.api;

import com.example.smart_test.domain.Subject;
import com.example.smart_test.dto.SubjectDto;

public interface SubjectMapperInterface {
    SubjectDto toDTO(Subject entity);

    Subject toEntity(SubjectDto dto);
}
