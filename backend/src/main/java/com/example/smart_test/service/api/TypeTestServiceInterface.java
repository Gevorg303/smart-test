package com.example.smart_test.service.api;

import com.example.smart_test.dto.TypeTestDto;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TypeTestServiceInterface {
    public TypeTestDto addTypeTestDto(TypeTestDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteTypeTestDto(TypeTestDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<TypeTestDto> getAllTypeTests();
}
