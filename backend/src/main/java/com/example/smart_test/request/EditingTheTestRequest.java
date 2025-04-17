package com.example.smart_test.request;

import com.example.smart_test.dto.TaskDto;
import com.example.smart_test.dto.TestDto;
import lombok.Data;

import java.util.List;

@Data
public class EditingTheTestRequest {
    private TestDto testDto;
    private List<TaskDto> taskDtoList;

    public EditingTheTestRequest(TestDto testDto, List<TaskDto> taskDtoList) {
        this.testDto = testDto;
        this.taskDtoList = taskDtoList;
    }
}
