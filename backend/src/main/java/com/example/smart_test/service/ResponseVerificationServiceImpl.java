package com.example.smart_test.service;

import com.example.smart_test.dto.ResponseOptionDto;
import com.example.smart_test.dto.TaskDto;
import com.example.smart_test.service.api.ResponseOptionServiceInterface;
import com.example.smart_test.service.api.ResponseVerificationServiceInterface;
import com.example.smart_test.service.api.TaskServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class ResponseVerificationServiceImpl implements ResponseVerificationServiceInterface {
    @Autowired
    private ResponseOptionServiceInterface responseOptionServiceInterface;
    @Autowired
    private TaskServiceInterface taskServiceInterface;

    @Override
    public boolean checkingResponse(TaskDto taskDto, String response) {
        List<ResponseOptionDto> responseOptionDtoList = responseOptionServiceInterface.getAllResponseOptions();
        TaskDto dto = taskServiceInterface.getTaskById(taskDto.getId());
        for (ResponseOptionDto responseOptionDto : responseOptionDtoList) {
            if (dto != null
                    && Objects.equals(dto.getId(), responseOptionDto.getTask().getId())
                    && Objects.equals(responseOptionDto.getResponse(), response)) {
                return true;
            }
        }
        return false;
    }
}
