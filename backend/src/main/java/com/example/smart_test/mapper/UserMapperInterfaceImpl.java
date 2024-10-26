package com.example.smart_test.mapper;

import com.example.smart_test.domain.User;
import com.example.smart_test.dto.UserDto;
import com.example.smart_test.mapper.api.UserMapperInterface;
import org.springframework.stereotype.Component;

@Component
public class UserMapperInterfaceImpl implements UserMapperInterface {
    @Override
    public UserDto toDTO(User entity) {
        UserDto dto = new UserDto();
        dto.setId(entity.getId());
        dto.setEmail(entity.getEmail());
        dto.setName(entity.getName());
        dto.setLogin(entity.getLogin());
        dto.setPatronymic(entity.getPatronymic());
        dto.setPasswordEncoder(entity.getPasswordEncoder());
        dto.setSurname(entity.getSurname());
        dto.setRole(entity.getRoles());
        return dto;
    }

    @Override
    public User toEntity(UserDto dto) {
        User entity = new User();
        entity.setId(dto.getId());
        entity.setEmail(dto.getEmail());
        entity.setName(dto.getName());
        entity.setLogin(dto.getLogin());
        entity.setPatronymic(dto.getPatronymic());
        entity.setPasswordEncoder(dto.getPasswordEncoder());
        entity.setSurname(dto.getSurname());
        entity.setRoles(dto.getRole());
        return entity;
    }
}
