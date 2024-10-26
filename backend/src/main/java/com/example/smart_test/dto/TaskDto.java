package com.example.smart_test.dto;

import com.example.smart_test.domain.Test;
import com.example.smart_test.domain.TypeTask;
import jakarta.persistence.Column;
import lombok.Data;

@Data
public class TaskDto {
    private Long id;
    private Test test;
    private TypeTask typeTask;
    private String taskName;
    private int assessmentTask;
    private String explanation;
    private String taskText;
}
