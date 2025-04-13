package com.example.smart_test.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "результаты_задания")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskResults {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "идентификатор_результатов_задани")
    private Long id;
    @ManyToOne
    @JoinColumn(name = "идентификатор_задания")
    private Task task;
    @Column(name = "пройден_индикатор")
    private boolean resultOfTheIndicator;
    @ManyToOne
    @JoinColumn(name = "идентификатор_попытка_тестирован")
    private TestingAttempt testingAttempt;

    public TaskResults(Task task, boolean resultOfTheIndicator, TestingAttempt testingAttempt) {
        this.task = task;
        this.resultOfTheIndicator = resultOfTheIndicator;
        this.testingAttempt = testingAttempt;
    }
}
