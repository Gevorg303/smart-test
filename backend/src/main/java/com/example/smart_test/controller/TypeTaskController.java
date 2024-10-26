package com.example.smart_test.controller;


import com.example.smart_test.dto.TypeTaskDto;
import com.example.smart_test.service.api.TypeTaskServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("TypeTask")
public class TypeTaskController {
    @Autowired
    private TypeTaskServiceInterface typeTaskService;

    @PostMapping("/add")
    public TypeTaskDto addTypeTaskDto(@RequestBody TypeTaskDto typeTaskDto) {
        return typeTaskService.addTypeTaskDto(typeTaskDto);
    }

    @DeleteMapping("/delete")
    public void deleteTypeTaskDto(@RequestBody TypeTaskDto typeTaskDto) {
        typeTaskService.deleteTypeTaskDto(typeTaskDto);
    }

    @GetMapping("/all")
    public List<TypeTaskDto> getTypeTaskDto() {
        return typeTaskService.getAllTypeTasks();
    }
}
