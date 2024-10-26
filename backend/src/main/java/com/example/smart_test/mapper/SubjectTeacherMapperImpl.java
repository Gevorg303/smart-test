package com.example.smart_test.mapper;

import com.example.smart_test.domain.SubjectTeacher;
import com.example.smart_test.dto.SubjectTeacherDto;
import com.example.smart_test.mapper.api.SubjectTeacherMapperInterface;
import org.springframework.stereotype.Component;

@Component
public class SubjectTeacherMapperImpl implements SubjectTeacherMapperInterface {
    @Override
    public SubjectTeacherDto toDto(SubjectTeacher entity) {
        SubjectTeacherDto dto = new SubjectTeacherDto();
        dto.setId(entity.getId());
        dto.setSubject(entity.getSubject());
        dto.setUser(entity.getUser());
        return dto;
    }

    @Override
    public SubjectTeacher toEntity(SubjectTeacherDto dto) {
        SubjectTeacher entity = new SubjectTeacher();
        entity.setId(dto.getId());
        entity.setSubject(dto.getSubject());
        entity.setUser(dto.getUser());
        return entity;
    }
}
