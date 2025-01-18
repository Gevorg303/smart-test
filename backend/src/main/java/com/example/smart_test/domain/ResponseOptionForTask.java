package com.example.smart_test.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "вариант_ответа_для_задания")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseOptionForTask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "идентификатор_варианта_ответа_для")
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "идентификатор_задания", nullable = false)
    private Task task;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "идентификатор_варианта_ответа", nullable = false)
    private ResponseOption responseOption;

    public ResponseOptionForTask(Task task, ResponseOption responseOption) {
        this.task = task;
        this.responseOption = responseOption;
    }
}