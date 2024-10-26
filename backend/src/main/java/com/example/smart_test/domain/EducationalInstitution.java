package com.example.smart_test.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "образовательное_учреждение")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EducationalInstitution {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "идентификатор_образовательное_уч")
    private Long id;
    @Column(name = "адрес")
    private String address;
    @Column(name = "наименование_учреждения")
    private String nameOfTheInstitution;
}
