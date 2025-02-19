package com.example.smart_test.response;

import lombok.Data;

@Data
public class UserResponse {
    private String login;
    private String rawPassword;
    private String email;
    private String name;
    private String patronymic;
    private String surname;

    public UserResponse(String login, String rawPassword, String email, String name, String patronymic, String surname) {
        this.login = login;
        this.rawPassword = rawPassword;
        this.email = email;
        this.name = name;
        this.patronymic = patronymic;
        this.surname = surname;
    }
}
