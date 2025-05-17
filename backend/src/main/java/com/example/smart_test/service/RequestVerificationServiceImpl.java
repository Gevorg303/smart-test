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
import java.util.stream.Collectors;

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
            List<ResponseOptionDto> correctOptions = responseOptionServiceInterface.getResponseOptionsByTaskTrue(requestForTask.getTask());

            // TODO: получаем пользовательские ответы на задание
            List<ResponseOptionDto> userOptions = requestForTask.getResponseOption();
            String taskType = requestForTask.getTask().getTypeTask().getTaskTypeName();

            // TODO: перебираем пользовательские ответы
            if (TypeTaskEnum.MATCHING_TASK.getDescription().equals(taskType)) {
                for (ResponseOptionDto userOption : userOptions) {
                    boolean isCorrect = false;

                    // TODO: сравниваем каждый пользовательский ответ с правильными
                    for (ResponseOptionDto correctOption : correctOptions) {
                        // TODO: логика для заданий на сопоставление
                        if (userOption.getQuestion() != null && correctOption.getQuestion() != null &&
                                userOption.getQuestion().equals(correctOption.getQuestion()) &&
                                userOption.getResponse().equals(correctOption.getResponse())) {
                            isCorrect = true;
                            break;
                        }
                    }

                    userOption.setValidResponse(isCorrect);
                    if (isCorrect) {
                        counterCorrectResponse++;
                    }
                    theUsersResponseOption.add(userOption);
                }

            } else if (TypeTaskEnum.MULTIPLE_CHOICE.getDescription().equals(taskType)) {
                // TODO: логика для заданий с выбором ответа (несколько вариантов)
                Set<String> correctSet = correctOptions.stream()
                        .map(ResponseOptionDto::getResponse)
                        .collect(Collectors.toSet());

                Set<String> userSet = userOptions.stream()
                        .map(ResponseOptionDto::getResponse)
                        .collect(Collectors.toSet());

                for (ResponseOptionDto userOption : userOptions) {

                   // boolean isCorrect = correctSet.contains(userOption.getResponse());
                    if (userOption.isValidResponse()) {
                        userOption.setValidResponse(true);
                    }
                    theUsersResponseOption.add(userOption);
                }

                // TODO: если хотя бы один лишний или пропущен правильный — оценка 0
                boolean isFullyCorrect = userSet.equals(correctSet);
                counterCorrectResponse = isFullyCorrect ? correctOptions.size() : 0;

            } else if (TypeTaskEnum.INPUT_ANSWER.getDescription().equals(taskType)) {
                // TODO: логика для заданий с вводом ответа
                for (ResponseOptionDto userOption : userOptions) {
                    boolean isCorrect = false;

                    // TODO: сравниваем каждый пользовательский ответ с правильными
                    for (ResponseOptionDto correctOption : correctOptions) {
                        if (userOption.getQuestion() == null &&
                                (correctOption.getQuestion() == null || correctOption.getQuestion().isBlank()) &&
                                userOption.getResponse().equals(correctOption.getResponse())) {
                            isCorrect = true;
                            break;
                        }
                    }

                    userOption.setValidResponse(isCorrect);
                    if (isCorrect) {
                        counterCorrectResponse++;
                    }
                    theUsersResponseOption.add(userOption);
                }
            }
            // TODO: вычисляем оценку по заданию
            int assessmentTask = correctOptions.isEmpty() ? 0
                    : (int) ((counterCorrectResponse * 100.0) / correctOptions.size());

            responseForTaskList.add(new ResponseForTask(
                    requestForTask.getTask(),
                    theUsersResponseOption,
                    assessmentTask
            ));
        }
        return responseForTaskList;
    }
}