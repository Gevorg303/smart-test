package com.example.smart_test.dto;

import com.example.smart_test.domain.Task;
import lombok.Data;

@Data
public class ResponseOptionDto {
    private Long id;
    private String question; // Вопрос (заполняется в случае если тип задания "На сопоставление")
    private String response; // Ответ
    private boolean validResponse; // Верно или нет
    private Task task;
}
