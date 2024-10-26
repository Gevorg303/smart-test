package com.example.smart_test.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "тип_теста")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TypeTest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "идентификатор_тип_теста")
    private Long id;
    @Column(name = "наименование_типа_теста")
    private String nameOfTestType;
}
