package com.example.smart_test.service;


import com.example.smart_test.domain.TypeTask;
import com.example.smart_test.dto.TypeTaskDto;
import com.example.smart_test.mapper.api.TypeTaskMapperInterface;
import com.example.smart_test.repository.TypeTaskRepositoryInterface;
import com.example.smart_test.service.api.TypeTaskServiceInterface;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TypeTaskServiceImpl implements TypeTaskServiceInterface {

    @Autowired
    private TypeTaskRepositoryInterface typeTaskRepositoryInterface;
    @Autowired
    private TypeTaskMapperInterface typeTaskMapperInterface;

    @Override
    public TypeTaskDto addTypeTaskDto(TypeTaskDto dto) {
        try {
            TypeTask typeTask = typeTaskMapperInterface.toEntity(dto);
            typeTask = typeTaskRepositoryInterface.save(typeTask);
            return typeTaskMapperInterface.toDto(typeTask);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при добавлении индикатора: " + e.getMessage(), e);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteTypeTaskDto(TypeTaskDto dto) {
        if (typeTaskRepositoryInterface.findById(dto.getId()).isPresent()) {
            TypeTask typeTask = typeTaskMapperInterface.toEntity(dto);
            typeTaskRepositoryInterface.delete(typeTask);
        } else {
            log.error("Индикатор с идентификатором " + dto.getId() + " не существует");
        }
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<TypeTaskDto> getAllTypeTasks() {
        try {
            List<TypeTask> typeTasks = typeTaskRepositoryInterface.findAll();
            return typeTasks.stream()
                    .map(typeTaskMapperInterface::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при получении всех индикаторов: " + e.getMessage(), e);
        }
    }

}
