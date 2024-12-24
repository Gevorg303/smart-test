package com.example.smart_test.controller;

import com.example.smart_test.response.ResponseForTask;
import com.example.smart_test.dto.TestDto;
import com.example.smart_test.service.api.ResponseVerificationServiceInterface;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/verification")
public class ResponseVerificationController {
    @Autowired
    private ResponseVerificationServiceInterface responseVerificationService;

    /**
     Выводит обект содержащий задание, веденый пользователем ответ, статус (верно/неверно)
     */
    @PostMapping("/result-test")
    public ResponseEntity<List<ResponseForTask>> checkingResponse(@RequestBody @Valid List<ResponseForTask> responseForTaskList) {
        List<ResponseForTask> result = responseVerificationService.checkingResponse(responseForTaskList);
        if (result.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(result);
    }
}
