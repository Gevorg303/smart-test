package com.example.smart_test.controller;

import com.example.smart_test.domain.ResponseOption;
import com.example.smart_test.dto.ResponseOptionDto;
import com.example.smart_test.dto.TaskDto;
import com.example.smart_test.service.api.ResponseOptionServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/response-option")
public class ResponseOptionController {
    @Autowired
    private ResponseOptionServiceInterface responseOptionService;

    /**
     * Метод для вывода вариантов ответа по заданию
     * */
    @PostMapping("/find-response-option-by-task")
    public ResponseEntity<List<ResponseOptionDto>> getResponseOptionsByTask(@RequestBody TaskDto taskDto) {
        List<ResponseOptionDto> responseOptions = responseOptionService.getResponseOptionsByTask(taskDto);
        return ResponseEntity.ok(responseOptions);
    }

//    @PostMapping("/add")
//    public ResponseOptionDto addResponseOption(@RequestBody ResponseOptionDto responseOptionDto) {
//        return responseOptionService.addResponseOptionDto(responseOptionDto);
//    }

    @DeleteMapping("/delete")
    public void deleteResponseOption(@RequestBody ResponseOptionDto responseOption) {
        responseOptionService.deleteResponseOption(responseOption);
    }

    @GetMapping("/all")
    public List<ResponseOptionDto> getAllResponseOption() {
        return responseOptionService.getAllResponseOptions();
    }
}
