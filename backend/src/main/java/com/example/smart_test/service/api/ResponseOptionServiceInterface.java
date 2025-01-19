package com.example.smart_test.service.api;

import com.example.smart_test.domain.ResponseOption;
import com.example.smart_test.domain.Task;
import com.example.smart_test.dto.ResponseOptionDto;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ResponseOptionServiceInterface {
    @Transactional
    ResponseOption addResponseOption(Task task, ResponseOption dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    void deleteResponseOptionDto(ResponseOptionDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    List<ResponseOptionDto> getAllResponseOptions();
}
