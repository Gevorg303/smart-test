package com.example.smart_test.mapper;

import com.example.smart_test.domain.Role;
import com.example.smart_test.dto.RoleDto;
import com.example.smart_test.mapper.api.RoleMapperInterface;
import org.springframework.stereotype.Component;

@Component
public class RoleMapperImpl implements RoleMapperInterface {
    @Override
    public RoleDto toDTO(Role entity) {
        RoleDto dto = new RoleDto();
        dto.setId(entity.getId());
        dto.setRole(entity.getRole());
        return dto;
    }

    @Override
    public Role toEntity(RoleDto dto) {
        Role entity = new Role();
        entity.setId(dto.getId());
        entity.setRole(dto.getRole());
        return entity;
    }
}
