package com.example.smart_test.service.api;

import com.example.smart_test.domain.Task;
import com.example.smart_test.domain.User;
import com.example.smart_test.dto.TestDto;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

public interface TestGeneratorServiceInterface {

    @Transactional
    Set<Task> generatorTasks(User user, TestDto test, int numberOfTasks);
}
