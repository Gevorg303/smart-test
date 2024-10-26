package com.example.smart_test.dto;

import com.example.smart_test.domain.Indicator;
import com.example.smart_test.domain.Task;
import jakarta.persistence.Column;
import lombok.Data;

@Data
public class TaskOfIndicatorDto {
    private Long id;
    private Task task;
    private Indicator indicator;
}
