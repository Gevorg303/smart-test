package com.example.smart_test.service.api;

import com.example.smart_test.dto.ResponseOptionDto;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ResponseOptionServiceInterface {
    public ResponseOptionDto addResponseOptionDto(ResponseOptionDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteResponseOptionDto(ResponseOptionDto dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<ResponseOptionDto> getAllResponseOptions();
}
