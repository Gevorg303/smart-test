package com.example.smart_test.controller;

import com.example.smart_test.request.RequestForTask;
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
     Выводит обект содержащий задание, веденый пользователем ответ, статус (верно/неверно)
     */
    @PostMapping("/result-test")
    public ResponseEntity<List<RequestForTask>> checkingResponse(@RequestBody @Valid List<RequestForTask> requestForTaskList) {
        List<RequestForTask> result = requestVerificationService.checkingResponse(requestForTaskList);
        if (result.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(result);
    }
}
