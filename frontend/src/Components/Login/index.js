import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "./styles.css"




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
            <div className="container">
                <div className="login-box">
                    <Form id="loginForm" onSubmit={this.handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Control type="text" name="username" id="username" placeholder="Логин" required/>
                            <Form.Control type="password" name="password" id="password" placeholder="Пароль" required/>
                            <Form.Text  id="errorlabel">

                            </Form.Text>

                        </Form.Group>
                        <Button  type="submit" >
                            Войти
                        </Button>
                    </Form>
                </div>
            </div>
        );
    }
}

export default LoginPage;
