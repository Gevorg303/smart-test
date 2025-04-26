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

    @Override
    public List<ResponseForTask> checkingResponse(List<RequestForTask> requestForTaskList) {
        List<ResponseForTask> responseForTaskList = new ArrayList<>();
        for (RequestForTask requestForTask : requestForTaskList) {
            int counterCorrectResponse = 0;
            List<ResponseOptionDto> theUsersResponseOption = new ArrayList<>();
            // TODO: получаем правильные варианты ответов на конкретное задание
            List<ResponseOptionDto> correctOptions = responseOptionServiceInterface.getResponseOptionsByTask(requestForTask.getTask());

            // TODO: получаем пользовательские ответы на задание
            List<ResponseOptionDto> userOptions = requestForTask.getResponseOption();
            String taskType = requestForTask.getTask().getTypeTask().getTaskTypeName();

            // TODO: перебираем пользовательские ответы
            for (ResponseOptionDto userOption : userOptions) {
                boolean isCorrect = false;

                // TODO: сравниваем каждый пользовательский ответ с правильными
                for (ResponseOptionDto correctOption : correctOptions) {
                    // TODO: логика для заданий на сопоставление
                    if (TypeTaskEnum.MATCHING_TASK.getDescription().equals(taskType)) {
                        if (userOption.getQuestion() != null && correctOption.getQuestion() != null &&
                                userOption.getQuestion().equals(correctOption.getQuestion()) &&
                                userOption.getResponse().equals(correctOption.getResponse())) {
                            isCorrect = true;
                            break;
                        }
                    }
                    // TODO: логика для заданий с выбором ответа или c одним ответом
                    else if (TypeTaskEnum.MULTIPLE_CHOICE.getDescription().equals(taskType)
                            || TypeTaskEnum.INPUT_ANSWER.name().equals(taskType)) {
                        if (userOption.getQuestion() == null && correctOption.getQuestion() == null &&
                                userOption.getResponse().equals(correctOption.getResponse())) {
                            isCorrect = true;
                            break;
                        }
                    }
                }
                userOption.setValidResponse(isCorrect);
                if (isCorrect) {
                    counterCorrectResponse++;
                }
                theUsersResponseOption.add(userOption);
            }
            // TODO: вычисляем оценку по заданию
            int assessmentTask = correctOptions.isEmpty() ? 0
                    : (int) ((counterCorrectResponse * 100.0) / correctOptions.size());

            responseForTaskList.add(new ResponseForTask(requestForTask.getTask(), theUsersResponseOption, assessmentTask));
        }
        return responseForTaskList;
    }
}