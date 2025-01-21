package com.example.smart_test.mapper;

import com.example.smart_test.domain.SubjectUser;
import com.example.smart_test.dto.SubjectUserDto;
import com.example.smart_test.mapper.api.SubjectUserMapperInterface;
import org.springframework.stereotype.Component;

@Component
public class SubjectUserMapperImpl implements SubjectUserMapperInterface {
    @Override
    public SubjectUserDto toDto(SubjectUser entity) {
        SubjectUserDto dto = new SubjectUserDto();
        dto.setId(entity.getId());
        dto.setSubject(entity.getSubject());
        dto.setUser(entity.getUser());
        return dto;
    }

    @Override
    public SubjectUser toEntity(SubjectUserDto dto) {
        SubjectUser entity = new SubjectUser();
        entity.setId(dto.getId());
        entity.setSubject(dto.getSubject());
        entity.setUser(dto.getUser());
        return entity;
    }
}
