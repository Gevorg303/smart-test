package com.example.smart_test.mapper;

import com.example.smart_test.domain.ResponseOption;
import com.example.smart_test.dto.ResponseOptionDto;
import com.example.smart_test.mapper.api.ResponseOptionMapperInterface;
import org.springframework.stereotype.Component;

@Component
public class ResponseOptionMapperImpl implements ResponseOptionMapperInterface {
    @Override
    public ResponseOptionDto toDTO(ResponseOption entity) {
        ResponseOptionDto dto = new ResponseOptionDto();
        dto.setId(entity.getId());
        dto.setQuestion(entity.getQuestion());
        dto.setResponse(entity.getResponse());
        dto.setValidResponse(entity.getValidResponse());
        dto.setTask(entity.getTask());
        return dto;
    }

    @Override
    public ResponseOption toEntity(ResponseOptionDto dto) {
        ResponseOption entity = new ResponseOption();
        entity.setId(dto.getId());
        entity.setQuestion(dto.getQuestion());
        entity.setResponse(dto.getResponse());
        entity.setValidResponse(dto.isValidResponse());
        entity.setTask(dto.getTask());
        return entity;
    }
}
