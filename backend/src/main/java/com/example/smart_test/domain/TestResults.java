package com.example.smart_test.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "результаты_теста")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TestResults {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "идентификатор_результаты_теста")
    private Long id;
    @ManyToOne
    @JoinColumn(name = "идентификатор_задания")
    private Task task;
    @ManyToOne
    @JoinColumn(name = "идентификатор_индикатор")
    private Indicator indicator;
    @ManyToOne
    @JoinColumn(name = "идентификатор_тест")
    private Test test;
    @ManyToOne
    @JoinColumn(name = "идентификатор_пользователя")
    private User user;
    @Column(name = "результат_индикатора")
    private boolean resultOfTheIndicator;
}
