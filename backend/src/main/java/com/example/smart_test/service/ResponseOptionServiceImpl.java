package com.example.smart_test.service;


import com.example.smart_test.domain.ResponseOption;
import com.example.smart_test.domain.Task;
import com.example.smart_test.dto.ResponseOptionDto;
import com.example.smart_test.dto.TaskDto;
import com.example.smart_test.mapper.api.ResponseOptionMapperInterface;
import com.example.smart_test.repository.ResponseOptionRepositoryInterface;
import com.example.smart_test.service.api.ResponseOptionServiceInterface;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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
    @Transactional
    public ResponseOption addResponseOption(Task task, ResponseOption responseOption) {
        try {
            responseOption.setTask(task);
            responseOption = responseOptionRepositoryInterface.save(responseOption);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при добавлении варианта ответа: " + e.getMessage(), e);
        }
        return responseOption;
    }

    @Override
    @Transactional
    public void deleteResponseOption(ResponseOption responseOption) {
        if (responseOptionRepositoryInterface.findById(responseOption.getId()).isPresent()) {
            responseOptionRepositoryInterface.delete(responseOption);
        } else {
            log.error("вариант ответа с идентификатором " + responseOption.getId() + " не найден");
        }
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<ResponseOptionDto> getAllResponseOptions() {
        try {
            List<ResponseOption> responses = responseOptionRepositoryInterface.findAll();
            return responses.stream()
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

    @Override
    @Transactional
    public List<ResponseOption> findAllResponseOptionsByTaskId(Task task) {
        List<ResponseOption> responses = responseOptionRepositoryInterface.findAll();
        List<ResponseOption> responseOptionList = new ArrayList<>();
        for (ResponseOption responseOption : responses) {
            if (responseOption.getTask().getId().equals(task.getId())) {
                responseOptionList.add(responseOption);
            }
        }
        return responseOptionList;
    }

    @Override
    public List<ResponseOptionDto> getResponseOptionsByTask(TaskDto taskDto) {
        List<ResponseOptionDto> responseOptionDtoList = new ArrayList<>();
        for (ResponseOption responseOption : responseOptionRepositoryInterface.findByTaskId(taskDto.getId())) {
            responseOptionDtoList.add(responseOptionMapperInterface.toDTO(responseOption));
        }
        return responseOptionDtoList;
    }

    @Override
    public void updateResponseOption(List<ResponseOptionDto> responseOptionDtoList) {
        for (ResponseOptionDto responseOptionDto : responseOptionDtoList) {
            ResponseOption responseOption = responseOptionRepositoryInterface.findById(responseOptionDto.getId()).orElse(null);
            if (responseOption != null) {
                responseOption.setResponse(responseOptionDto.getResponse());
                responseOption.setQuestion(responseOptionDto.getQuestion());
                responseOptionRepositoryInterface.save(responseOption);
            }
        }
    }
}
