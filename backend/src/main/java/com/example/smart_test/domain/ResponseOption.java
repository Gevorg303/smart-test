package com.example.smart_test.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "вариант_ответа")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "идентификатор_вариант_ответа")
    private Long id;
    @Column(name = "вопрос")
    private String question;
    @Column(name = "ответ")
    private String response;
    @Column(name = "верный_ответ")
    private boolean validResponse;
    @ManyToOne
    @JoinColumn(name = "идентификатор_задание")
    private Task task;
}
