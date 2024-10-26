package com.example.smart_test.service.api;

import com.example.smart_test.dto.RoleDto;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface RoleServiceInterface {
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    List<RoleDto> getAllRole();
}
