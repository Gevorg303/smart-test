package com.example.smart_test.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalTime;

@Entity
@Table(name = "попытка_тестирования")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TestingAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "идентификатор_попытка_тестирован")
    private Long id;

    @NotNull
    @Column(name = "дата_и_время_начала_попытки", nullable = false)
    private Instant startDateTime;

    @NotNull
    @Column(name = "длительность_прохождения_попытки", nullable = false)
    private LocalTime attemptDuration;

    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(name = "идентификатор_тест", nullable = false)
    private Test test;

    @ManyToOne
    @JoinColumn(name = "идентификатор_пользователь")
    private User user;

    @Column(name = "результат_прохождения_теста")
    private int testResult;

    public TestingAttempt(Instant startDateTime, LocalTime attemptDuration, Test test, User user) {
        this.startDateTime = startDateTime;
        this.attemptDuration = attemptDuration;
        this.test = test;
        this.user = user;
    }
}
