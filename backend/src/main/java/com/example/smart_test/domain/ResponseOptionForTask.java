package com.example.smart_test.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "вариант_ответа_для_задания")
public class ResponseOptionForTask  {
    @Id
    @Column(name = "идентификатор_варианта_ответа_для", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "идентификатор_задания", nullable = false)
    private Task task;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "идентификатор_варианта_ответа", nullable = false)
    private ResponseOption responseOption;
}