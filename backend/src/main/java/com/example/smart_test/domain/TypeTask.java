package com.example.smart_test.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "тип_задания")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TypeTask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "идентификатор_тип_задания")
    private Long id;
    @Column(name = "наименование_тип_задания")
    private String taskTypeName;
}
