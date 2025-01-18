package com.example.smart_test.service.api;

import com.example.smart_test.domain.Indicator;
import com.example.smart_test.domain.ResponseOption;
import com.example.smart_test.domain.ResponseOptionForTask;
import com.example.smart_test.domain.Task;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ResponseOptionForTaskServiceInterface {
    @Transactional
    void addResponseOptionForTask(Task task, ResponseOption responseOption);

    @Transactional(readOnly = true)
    List<ResponseOptionForTask> getAllResponseOptionsForTask();
}