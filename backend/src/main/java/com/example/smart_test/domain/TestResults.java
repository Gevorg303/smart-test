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
public class TestResults {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "идентификатор_результатов_задани")
    private Long id;
    @ManyToOne
    @JoinColumn(name = "идентификатор_задания")
    private Task task;
    @Column(name = "результат_пройденного_задания")
    private boolean resultOfTheIndicator;
}
