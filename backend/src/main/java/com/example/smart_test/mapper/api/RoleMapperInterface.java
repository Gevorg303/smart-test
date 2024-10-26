package com.example.smart_test.mapper.api;

import com.example.smart_test.domain.Role;
import com.example.smart_test.dto.RoleDto;

public interface RoleMapperInterface {
    RoleDto toDTO(Role entity);

    Role toEntity(RoleDto dto);
}
