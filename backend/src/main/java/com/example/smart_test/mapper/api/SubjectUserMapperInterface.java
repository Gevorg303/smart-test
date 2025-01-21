package com.example.smart_test.mapper.api;

import com.example.smart_test.domain.SubjectUser;
import com.example.smart_test.dto.SubjectUserDto;

public interface SubjectUserMapperInterface {

    public SubjectUserDto toDto(SubjectUser entity);

    public SubjectUser toEntity(SubjectUserDto dto);
}
