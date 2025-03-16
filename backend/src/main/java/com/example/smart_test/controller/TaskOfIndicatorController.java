package com.example.smart_test.controller;

import com.example.smart_test.domain.Indicator;
import com.example.smart_test.domain.Task;
import com.example.smart_test.domain.TaskOfIndicator;
import com.example.smart_test.dto.IndicatorDto;
import com.example.smart_test.dto.TaskDto;
import com.example.smart_test.dto.TaskOfIndicatorDto;
import com.example.smart_test.service.api.TaskOfIndicatorServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/task-of-indicator")
public class TaskOfIndicatorController {
    @Autowired
    private TaskOfIndicatorServiceInterface taskOfIndicatorService;

    /**
     * Метод для вывода списка индикатор по заданию
     * */
    @PostMapping("/find-indicator-by-task")
    public ResponseEntity<List<IndicatorDto>> getIndicatorsByTask(@RequestBody Task task) {
        List<IndicatorDto> indicators = taskOfIndicatorService.findIndicatorByTask(task);
        return ResponseEntity.ok(indicators);
    }


//    @PostMapping("/add")
//    public TaskOfIndicatorDto addTaskOfIndicatorDto(@RequestBody TaskOfIndicatorDto taskOfIndicatorDto) {
//        return taskOfIndicatorService.addTaskOfIndicatorDto(taskOfIndicatorDto);
//    }

//    @DeleteMapping("/delete")
//    public void deleteTaskOfIndicatorDto(@RequestBody TaskOfIndicator taskOfIndicator) {
//        taskOfIndicatorService.deleteTaskOfIndicator(taskOfIndicator);
//    }
//
//    @GetMapping("/all")
//    public List<TaskOfIndicatorDto> getTaskOfIndicatorDto() {
//        return taskOfIndicatorService.getAllTaskOfIndicators();
//    }
}
