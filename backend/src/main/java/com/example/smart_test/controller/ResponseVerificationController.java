package com.example.smart_test.controller;

import com.example.smart_test.dto.TaskDto;
import com.example.smart_test.service.api.ResponseVerificationServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/verification")
public class ResponseVerificationController {
    @Autowired
    private ResponseVerificationServiceInterface responseVerificationService;

    /**
     Проверка веденного ответа, необходимо передать само задание и введеный ответ /verification/response?response=5
     * */
    @PostMapping("/response")
    public boolean checkingResponse(@RequestBody TaskDto taskDto, @RequestParam String response) {
        return responseVerificationService.checkingResponse(taskDto, response);
    }
}
