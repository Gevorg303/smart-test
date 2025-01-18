package com.example.smart_test.service;

import com.example.smart_test.domain.*;
import com.example.smart_test.repository.ResponseOptionForTaskRepositoryInterface;
import com.example.smart_test.service.api.ResponseOptionForTaskServiceInterface;
import com.example.smart_test.service.api.ResponseOptionServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ResponseOptionForTaskServiceImpl implements ResponseOptionForTaskServiceInterface {
    @Autowired
    private ResponseOptionForTaskRepositoryInterface responseOptionForTaskRepository;
    @Autowired
    private ResponseOptionServiceInterface responseOptionService;

    @Override
    @Transactional
    public void addResponseOptionForTask(Task task, ResponseOption responseOption) {
        try {
            ResponseOption responseOption1 = responseOptionService.addResponseOption(responseOption);
            responseOptionForTaskRepository.save(new ResponseOptionForTask(task, responseOption1));
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при добавлении варианта ответа для задания: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResponseOptionForTask> getAllResponseOptionsForTask() {
        return responseOptionForTaskRepository.findAll();
    }
}