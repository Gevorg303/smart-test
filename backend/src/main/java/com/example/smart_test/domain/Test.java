package com.example.smart_test.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;

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
}
