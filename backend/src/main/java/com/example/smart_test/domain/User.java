package com.example.smart_test.domain;

import java.util.ArrayList;
import java.util.Collection;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "пользователь")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "идентификатор_пользователя")
    private Long id;
    @Column(name = "email_пользователя")
    private String email;
    @Column(name = "имя_пользователя")
    private String name;
    @Column(name = "логин_пользователя")
    private String login;
    @Column(name = "отчество_пользователя")
    private String patronymic;
    @Column(name = "пароль_пользователя")
    private String passwordEncoder;
    @Column(name = "фамилия_пользователя")
    private String surname;
    @ManyToOne
    @JoinColumn(name = "роль_пользователя")
    private Role roles;

    @Override
    public String getPassword() {
        return passwordEncoder;
    }

    @Override
    public String getUsername() {
        return login;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return new ArrayList<GrantedAuthority>();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
}
