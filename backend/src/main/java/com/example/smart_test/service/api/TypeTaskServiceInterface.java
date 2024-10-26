package com.example.smart_test.service.api;

import com.example.smart_test.dto.TypeTaskDto;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TypeTaskServiceInterface {
    public TypeTaskDto addTypeTaskDto(TypeTaskDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteTypeTaskDto(TypeTaskDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<TypeTaskDto> getAllTypeTasks();
}
