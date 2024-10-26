package com.example.smart_test.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "индикатор")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Indicator {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "идентификатор_индикатор")
    private Long id;
    @ManyToOne
    @JoinColumn(name = "идентификатор_тема")
    private Theme theme;
    @Column(name = "наименование_индикатора")
    private String nameOfTheIndicator;
}
