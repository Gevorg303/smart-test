package com.example.smart_test.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "класс")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentClass {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "идентификатор_класс")
    private Long id;
    @Column(name = "буквенное_обозначение")
    private String letterDesignation;
    @ManyToOne
    @JoinColumn(name = "идентификатор_образовательное_уч")
    private EducationalInstitution educationalInstitution;
    @Column(name = "номер_класса")
    private String numberOfInstitution;
    @NotNull
    @Column(name = "флаг_мягкого_удаления", nullable = false)
    private Boolean isDelete  = false;

}
