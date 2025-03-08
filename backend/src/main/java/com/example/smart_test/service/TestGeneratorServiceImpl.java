package com.example.smart_test.service;

import com.example.smart_test.domain.*;
import com.example.smart_test.dto.TestDto;
import com.example.smart_test.service.api.TaskOfIndicatorServiceInterface;
import com.example.smart_test.service.api.TaskResultsServiceInterface;
import com.example.smart_test.service.api.TestGeneratorServiceInterface;
import com.example.smart_test.service.api.TestingAttemptServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class TestGeneratorServiceImpl implements TestGeneratorServiceInterface {
    @Autowired
    private TestingAttemptServiceInterface testingAttemptService;
    @Autowired
    private TaskResultsServiceInterface taskResultsService;
    @Autowired
    private TaskOfIndicatorServiceInterface taskOfIndicatorService;

    @Transactional
    @Override
    public Set<Task> generatorTasks(User user, TestDto test, int numberOfTasks) {
        Set<Task> tasks = new LinkedHashSet<>();
        Set<Task> processedTasks = new HashSet<>();
        List<Task> availableTasks = new ArrayList<>();
        int counter = 0;

        TestingAttempt testingAttempt = testingAttemptService.findTestingAttemptByTest(user, test);
        List<TaskResults> taskResultsList = taskResultsService.findTaskResultsByTestingAttempt(testingAttempt);

        for (TaskResults taskResults : taskResultsList) {
            Task currentTask = taskResults.getTask();

            if (processedTasks.contains(currentTask)) {
                continue;
            }
            processedTasks.add(currentTask);

            List<TaskOfIndicator> taskOfIndicatorList = taskOfIndicatorService.findTaskOfIndicatorByTask(currentTask);

            for (TaskOfIndicator taskOfIndicator : taskOfIndicatorList) {
                List<TaskOfIndicator> taskOfIndicatorByIndicator = taskOfIndicatorService.findTaskOfIndicatorByIndicator(taskOfIndicator.getIndicator());

                Collections.shuffle(taskOfIndicatorByIndicator);

                for (TaskOfIndicator taskOfIndicator1 : taskOfIndicatorByIndicator) {
                    Task candidateTask = taskOfIndicator1.getTask();
                    if (candidateTask.getTest() == null && !availableTasks.contains(candidateTask)) {
                        availableTasks.add(candidateTask);
                    }
                }
            }
        }

        Collections.shuffle(availableTasks);

        for (Task task : availableTasks) {
            if (counter >= numberOfTasks * taskResultsList.size()) {
                break;
            }
            tasks.add(task);
            counter++;
        }

        return tasks;
    }
}
