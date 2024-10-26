package com.example.smart_test.service;

import com.example.smart_test.domain.Role;
import com.example.smart_test.dto.RoleDto;
import com.example.smart_test.mapper.api.RoleMapperInterface;
import com.example.smart_test.repository.RoleRepositoryInterface;
import com.example.smart_test.service.api.RoleServiceInterface;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class RoleServiceImpl implements RoleServiceInterface {
    @Autowired
    private RoleRepositoryInterface roleRepository;
    @Autowired
    private RoleMapperInterface roleMapper;

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<RoleDto> getAllRole() {
        try {
            List<Role> institutions = roleRepository.findAll();
            return institutions.stream()
                    .map(roleMapper::toDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при получении всех классов: " + e.getMessage(), e);
        }
    }
}
