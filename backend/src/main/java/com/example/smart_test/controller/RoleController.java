package com.example.smart_test.controller;

import com.example.smart_test.dto.RoleDto;
import com.example.smart_test.service.api.RoleServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/role")
public class RoleController {

    @Autowired
    private RoleServiceInterface roleService;

    @GetMapping("/all")
    public ResponseEntity<List<RoleDto>> getAllRoles() {
        List<RoleDto> roles = roleService.getAllRole();
        return ResponseEntity.ok().body(roles);
    }
}
