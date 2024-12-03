import React, { useState } from 'react';
import { Navigate } from "react-router-dom";
import '../css/StylesForLogin.css';
import HomePage from "./Home";



class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.username = {value: ''};
        this.password = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }



    handleChange(event) {
        this.setState({value: event.target.value});
    }

   async handleSubmit(event) {
        event.preventDefault();

       const username = document.getElementById('username').value;
       const password = document.getElementById('password').value;
       let errorlabel = document.getElementById('errorlabel');

       console.log('Sending request with:', JSON.stringify({ username, password }));
       errorlabel.innerHTML = "";
       try {
           const response = await fetch('http://localhost:8080/api/login', {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json;charset=UTF-8'
               },
               body: JSON.stringify({ username, password })
           });

           if (response.ok) {
               const token = await response.text();
               console.log('Received token:', token);
               document.cookie = "jwtToken="+token+"; path=/;"
               window.location.href = '/home'; // Перенаправление на другую страницу
           } else {
               const errorText = await response.text();
               console.error('Login failed:', errorText);
               errorlabel.innerHTML = "Неверный пароль или логин";
           }
       } catch (error) {
           console.error('Error during fetch:', error);
       }

    }

    render() {
        return (
            <form id="loginForm" onSubmit={this.handleSubmit}>
                <div>
                    <input type="text" name="username" id="username" placeholder="Логин" required/>
                    <input type="password" name="password" id="password" placeholder="Пароль" required/>
                    <h4 id="errorlabel"></h4>
                    <input type="submit" value="Войти"/>
                </div>
            </form>
        );
    }
}

export default LoginPage;
