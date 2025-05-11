package com.example.smart_test.request;

import com.example.smart_test.dto.TestDto;
import lombok.Data;

import java.util.List;

@Data
public class EditingTheTestRequest {
    private TestDto testDto;
    private List<EditingTaskRequest> editingTaskRequests; //добавлять задания которые нужно удалить/добавить с указанием флага

    public EditingTheTestRequest(TestDto testDto, List<EditingTaskRequest> editingTaskRequests) {
        this.testDto = testDto;
        this.editingTaskRequests = editingTaskRequests;
    }
}
