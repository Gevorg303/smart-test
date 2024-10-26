package com.example.smart_test.service;


import com.example.smart_test.domain.TypeTest;
import com.example.smart_test.dto.TypeTestDto;
import com.example.smart_test.mapper.api.TypeTestMapperInterface;
import com.example.smart_test.repository.TypeTestRepositoryInterface;
import com.example.smart_test.service.api.TypeTestServiceInterface;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TypeTestServiceImpl implements TypeTestServiceInterface {

    @Autowired
    private TypeTestRepositoryInterface typeTestRepositoryInterface;
    @Autowired
    private TypeTestMapperInterface typeTestMapperInterface;

    @Override
    public TypeTestDto addTypeTestDto(TypeTestDto dto) {
        try {
            TypeTest typeTest = typeTestMapperInterface.toEntity(dto);
            typeTest = typeTestRepositoryInterface.save(typeTest);
            return typeTestMapperInterface.toDto(typeTest);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при добавлении индикатора: " + e.getMessage(), e);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteTypeTestDto(TypeTestDto dto) {
        if (typeTestRepositoryInterface.findById(dto.getId()).isPresent()) {
            TypeTest typeTest = typeTestMapperInterface.toEntity(dto);
            typeTestRepositoryInterface.delete(typeTest);
        } else {
            log.error("Индикатор с идентификатором " + dto.getId() + " не существует");
        }
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<TypeTestDto> getAllTypeTests() {
        try {
            List<TypeTest> typeTests = typeTestRepositoryInterface.findAll();
            return typeTests.stream()
                    .map(typeTestMapperInterface::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при получении всех индикаторов: " + e.getMessage(), e);
        }
    }

}
