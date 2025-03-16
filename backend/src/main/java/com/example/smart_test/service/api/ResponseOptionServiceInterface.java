package com.example.smart_test.service.api;

import com.example.smart_test.domain.ResponseOption;
import com.example.smart_test.domain.Task;
import com.example.smart_test.dto.ResponseOptionDto;
import com.example.smart_test.dto.TaskDto;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ResponseOptionServiceInterface {
    @Transactional
    ResponseOption addResponseOption(Task task, ResponseOption dto);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    void deleteResponseOption(ResponseOption responseOption);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    List<ResponseOptionDto> getAllResponseOptions();

    @Transactional
    List<ResponseOption> findAllResponseOptionsByTaskId(Task task);

    List<ResponseOptionDto> getResponseOptionsByTask(TaskDto taskDto);
}
