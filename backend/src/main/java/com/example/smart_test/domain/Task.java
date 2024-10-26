package com.example.smart_test.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "задание")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "идентификатор_задание")
    private Long id;
    @ManyToOne
    @JoinColumn(name = "идентификатор_тест")
    private Test test;
    @ManyToOne
    @JoinColumn(name = "идентификатор_тип_задания")
    private TypeTask typeTask;
    @Column(name = "название_задания")
    private String taskName;
    @Column(name = "оценка_за_задание")
    private int assessmentTask;
    @Column(name = "пояснение")
    private String explanation;
    @Column(name = "текст_задания")
    private String taskText;
}
