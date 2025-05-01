package com.example.smart_test.request;

import com.example.smart_test.dto.IndicatorDto;
import com.example.smart_test.dto.TaskDto;
import com.example.smart_test.dto.TestDto;
import lombok.Data;

import java.util.List;

@Data
public class EditingTheTestRequest {
    private TestDto testDto;
    private List<EditingTaskRequest> editingTaskRequests; //добавлять задания которые нужно удалить/добавить с указанием флага
    private IndicatorDto indicator;

    public EditingTheTestRequest(TestDto testDto, List<EditingTaskRequest> editingTaskRequests, IndicatorDto indicator) {
        this.testDto = testDto;
        this.editingTaskRequests = editingTaskRequests;
        this.indicator = indicator;
    }
}
