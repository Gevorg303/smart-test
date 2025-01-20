package com.example.smart_test.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "задание_по_индикато")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskOfIndicator {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "идентификатор_задание_по_индикато")
    private Long id;
    @ManyToOne
    @JoinColumn(name = "идентификатор_задание")
    private Task task;
    @ManyToOne
    @JoinColumn(name = "идентификатор_индикатор")
    private Indicator indicator;

    public TaskOfIndicator(Task task, Indicator indicator) {
        this.task = task;
        this.indicator = indicator;
    }

    public TaskOfIndicator(Task task) {
        this.task = task;
    }
}
