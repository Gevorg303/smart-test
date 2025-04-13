package com.example.smart_test.service;

import com.example.smart_test.dto.ResponseOptionDto;
import com.example.smart_test.enums.TypeTaskEnum;
import com.example.smart_test.request.RequestForTask;
import com.example.smart_test.response.ResponseForTask;
import com.example.smart_test.service.api.RequestVerificationServiceInterface;
import com.example.smart_test.service.api.ResponseOptionServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RequestVerificationServiceImpl implements RequestVerificationServiceInterface {
    @Autowired
    private ResponseOptionServiceInterface responseOptionServiceInterface;
    //в каком случае индикатор считается выполненным
    @Override
    public List<ResponseForTask> checkingResponse(List<RequestForTask> requestForTaskList) {
        List<ResponseForTask> responseForTaskList = new ArrayList<>();
        // TODO: перебираем сущность которая содержит задание и варианты ответа к заданию
        for (RequestForTask requestForTask : requestForTaskList) {
            int counterCorrectResponse = 0;
            List<ResponseOptionDto> theUsersResponseOption = new ArrayList<>();
            // TODO: для каждого задания находим все его варианты ответов
            List<ResponseOptionDto> responseOptionDtoList = responseOptionServiceInterface.getResponseOptionsByTask(requestForTask.getTask());
            // TODO: для заданий на сопоставление
            if (requestForTask.getTask().getTypeTask().getTaskTypeName().equals(TypeTaskEnum.MATCHING_TASK.name())) {

                for (ResponseOptionDto responseOptionDto : responseOptionDtoList) {
                    if (responseOptionDto.getQuestion() != null) {
                        // TODO: варианты ответов по заданию которые дал пользователь
                        for (ResponseOptionDto responseOptionDto2 : requestForTask.getResponseOption()) {
                            if (responseOptionDto2.getQuestion() != null
                                    && responseOptionDto2.getQuestion().equals(responseOptionDto.getQuestion())
                                    && responseOptionDto2.getResponse().equals(responseOptionDto.getResponse())) {
                                responseOptionDto2.setEvaluationResponse(true);
                                counterCorrectResponse++;
                                theUsersResponseOption.add(responseOptionDto2);
                            } else {
                                responseOptionDto2.setEvaluationResponse(false);
                                theUsersResponseOption.add(responseOptionDto2);
                            }
                        }
                    }
                }
            }
            // TODO: для заданий на выбор ответов и на один ответ
            if (requestForTask.getTask().getTypeTask().getTaskTypeName().equals(TypeTaskEnum.MULTIPLE_CHOICE.name())
                    || requestForTask.getTask().getTypeTask().getTaskTypeName().equals(TypeTaskEnum.INPUT_ANSWER.name())) {
                for (ResponseOptionDto responseOptionDto : responseOptionDtoList) {
                    if (responseOptionDto.getQuestion() == null) {
                        // TODO: варианты ответов по заданию которые дал пользователь
                        for (ResponseOptionDto responseOptionDto2 : requestForTask.getResponseOption()) {
                            if (responseOptionDto2.getQuestion() == null
                                    && responseOptionDto2.getResponse().equals(responseOptionDto.getResponse())) {
                                responseOptionDto2.setEvaluationResponse(true);
                                counterCorrectResponse++;
                                theUsersResponseOption.add(responseOptionDto2);
                            } else {
                                responseOptionDto2.setEvaluationResponse(false);
                                theUsersResponseOption.add(responseOptionDto2);
                            }
                        }
                    }
                }
            }
            int assessmentTask = (int) ((counterCorrectResponse * 100.0) / responseOptionDtoList.size());
            requestForTask.getTask().setAssessmentTask(assessmentTask);
            responseForTaskList.add(new ResponseForTask(requestForTask.getTask(), theUsersResponseOption, null));
        }
        return responseForTaskList;
    }
}
