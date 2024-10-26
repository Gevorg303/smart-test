package com.example.smart_test.mapper;

import com.example.smart_test.domain.Subject;
import com.example.smart_test.dto.SubjectDto;
import com.example.smart_test.mapper.api.SubjectMapperInterface;
import org.springframework.stereotype.Component;

@Component
public class SubjectMapperImpl implements SubjectMapperInterface {
    @Override
    public SubjectDto toDTO(Subject entity) {
        SubjectDto dto = new SubjectDto();
        dto.setId(entity.getId());
        dto.setSubjectName(entity.getSubjectName());
        dto.setDescription(entity.getDescription());
        dto.setTeacherClass(entity.getTeacherClass());
        return dto;
    }

    @Override
    public Subject toEntity(SubjectDto dto) {
        Subject entity = new Subject();
        entity.setId(dto.getId());
        entity.setSubjectName(dto.getSubjectName());
        entity.setDescription(dto.getDescription());
        entity.setTeacherClass(dto.getTeacherClass());
        return entity;
    }
}
