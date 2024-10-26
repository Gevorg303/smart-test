package com.example.smart_test.service;


import com.example.smart_test.domain.ResponseOption;
import com.example.smart_test.dto.ResponseOptionDto;
import com.example.smart_test.mapper.api.ResponseOptionMapperInterface;
import com.example.smart_test.repository.ResponseOptionRepositoryInterface;
import com.example.smart_test.service.api.ResponseOptionServiceInterface;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ResponseOptionServiceImpl implements ResponseOptionServiceInterface {

    @Autowired
    private ResponseOptionRepositoryInterface responseOptionRepositoryInterface;
    @Autowired
    private ResponseOptionMapperInterface responseOptionMapperInterface;

    @Override
    public ResponseOptionDto addResponseOptionDto(ResponseOptionDto dto) {
        try {
            ResponseOption responseOption = responseOptionMapperInterface.toEntity(dto);
            responseOption = responseOptionRepositoryInterface.save(responseOption);
            return responseOptionMapperInterface.toDTO(responseOption);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при добавлении варианта ответа: " + e.getMessage(), e);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteResponseOptionDto(ResponseOptionDto dto) {
        if (responseOptionRepositoryInterface.findById(dto.getId()).isPresent()) {
            ResponseOption responseOption = responseOptionMapperInterface.toEntity(dto);
            responseOptionRepositoryInterface.delete(responseOption);
        } else {
            log.error("вариант ответа с идентификатором " + dto.getId() + " не существует");
        }
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<ResponseOptionDto> getAllResponseOptions() {
        try {
            List<ResponseOption> indicators = responseOptionRepositoryInterface.findAll();
            return indicators.stream()
                    .map(responseOptionMapperInterface::toDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при получении всех вариантов ответа: " + e.getMessage(), e);
        }
    }

    private boolean findResponseOptionById(Long id) {
        Optional<ResponseOption> indicator = responseOptionRepositoryInterface.findById(id);
        return indicator.isPresent();
    }
}
