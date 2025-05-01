package com.example.smart_test.request;

import com.example.smart_test.dto.ResponseOptionDto;
import lombok.Data;


@Data
public class EditingResponseOptionRequest {
    private ResponseOptionDto responseOptionDto;
    private boolean isDeleted;//флаг для удаления варианта ответа

    public EditingResponseOptionRequest(ResponseOptionDto responseOptionDto, boolean isDeleted) {
        this.responseOptionDto = responseOptionDto;
        this.isDeleted = isDeleted;
    }
}
