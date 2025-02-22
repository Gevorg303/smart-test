package com.example.smart_test.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "пользователь_предмет")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubjectUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "идентификатор_пользователь_предм")
    private Long id;
    @ManyToOne
    @JoinColumn(name = "идентификатор_предмет")
    private Subject subject;
    @ManyToOne
    @JoinColumn(name = "идентификатор_пользователя")
    private User user;

    public SubjectUser(Subject subject, User user) {
        this.subject = subject;
        this.user = user;
    }
}

