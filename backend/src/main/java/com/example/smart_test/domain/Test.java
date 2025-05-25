package com.example.smart_test.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "тест")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Test {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "идентификатор_тест")
    private Long id;
    @Column(name = "время_прохождения")
    private LocalTime passageTime;
    @Column(name = "дата_и_время_закрытия")
    private LocalDateTime closingDateAndTime;
    @Column(name = "дата_и_время_открытия")
    private LocalDateTime openingDateAndTime;
    @ManyToOne
    @JoinColumn(name = "идентификатор_тема")
    private Theme theme;
    @ManyToOne
    @JoinColumn(name = "идентификатор_тип_теста")
    private TypeTest typeTest;
    @Column(name = "количество_попыток_прохождения")
    private int numberOfAttemptsToPass;
    @Column(name = "описание")
    private String description;
    @Column(name = "пароль_теста")
    private String testPassword;
    @Column(name = "количсетво_заданий_на_одну_ошибку")
    private Integer numberOfTasksPerError;
    @Column(name = "порог_прохождения_теста")
    private Integer passThreshold;
    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Task> tasks = new ArrayList<>();
    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TestingAttempt> attempts = new ArrayList<>();

}
