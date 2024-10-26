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
        dto.setTask(entity.getTask());
        dto.setResponse(entity.getResponse());
        dto.setEvaluationResponse(entity.getEvaluationResponse());
        return dto;
    }

    @Override
    public ResponseOption toEntity(ResponseOptionDto dto) {
        ResponseOption entity = new ResponseOption();
        entity.setId(dto.getId());
        entity.setQuestion(dto.getQuestion());
        entity.setTask(dto.getTask());
        entity.setResponse(dto.getResponse());
        entity.setEvaluationResponse(dto.getEvaluationResponse());
        return entity;
    }
}
