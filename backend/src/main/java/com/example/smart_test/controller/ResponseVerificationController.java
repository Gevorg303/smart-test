package com.example.smart_test.controller;

import com.example.smart_test.domain.ResponseOption;
import com.example.smart_test.request.RequestForTask;
import com.example.smart_test.response.ResponseForTask;
import com.example.smart_test.service.api.RequestVerificationServiceInterface;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/verification")
public class ResponseVerificationController {
    @Autowired
    private RequestVerificationServiceInterface requestVerificationService;

    /**
     Выводит объект содержащий задание, веденный пользователем ответ, статус (верно/неверно)
     */
    @PostMapping("/result-test")
    public ResponseEntity<List<ResponseForTask>> checkingResponse(@RequestBody @Valid List<RequestForTask> requestForTaskList) {
        List<ResponseForTask> result = requestVerificationService.checkingResponse(requestForTaskList);
        if (result.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(result);
    }
}
