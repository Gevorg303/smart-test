package com.example.smart_test.controller;


import com.example.smart_test.dto.TypeTestDto;
import com.example.smart_test.service.api.TypeTestServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("TypeTest")
public class TypeTestController {
    @Autowired
    private TypeTestServiceInterface typeTestService;

    @PostMapping("/add")
    public TypeTestDto addTypeTestDto(@RequestBody TypeTestDto typeTestDto) {
        return typeTestService.addTypeTestDto(typeTestDto);
    }

    @DeleteMapping("/delete")
    public void deleteTypeTestDto(@RequestBody TypeTestDto typeTestDto) {
        typeTestService.deleteTypeTestDto(typeTestDto);
    }

    @GetMapping("/all")
    public List<TypeTestDto> getTypeTestDto() {
        return typeTestService.getAllTypeTests();
    }
}
