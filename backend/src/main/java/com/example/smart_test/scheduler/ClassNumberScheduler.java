package com.example.smart_test.scheduler;

import com.example.smart_test.service.api.StudentClassServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ClassNumberScheduler {

    private final StudentClassServiceInterface studentClassService;

    /**
     * Выполняется 1 сентября каждый год в 00:00
     */
    @Scheduled(cron = "0 0 0 31 8 *")
    public void updateClassNumbers() {
        studentClassService.incrementClassNumbers();
    }
}
