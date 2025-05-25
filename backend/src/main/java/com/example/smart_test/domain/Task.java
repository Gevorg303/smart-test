package com.example.smart_test.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

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
    @Column(name = "пояснение")
    private String explanation;
    @Column(name = "текст_задания")
    private String taskText;
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TaskResults> results = new ArrayList<>();
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TaskOfIndicator> taskOfIndicators = new ArrayList<>();
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ResponseOption> responseOptions = new ArrayList<>();
}
