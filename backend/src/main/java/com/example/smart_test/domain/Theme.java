package com.example.smart_test.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "тема")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Theme {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "идентификатор_тема")
    private Long id;
    @ManyToOne
    @JoinColumn(name = "идентификатор_предмет")
    private Subject subject;
    @Column(name = "название_темы")
    private String themeName;
}
