import React, { useState } from 'react';
import './StylesForLogin.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorLabel, setErrorLabel] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorLabel("");

        console.log('Sending request with:', JSON.stringify({ username, password }));

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const token = await response.text();
                console.log('Received token:', token);
                document.cookie = "jwtToken=" + token + "; path=/;";
                window.location.href = 'main'; // Перенаправление на другую страницу
            } else {
                const errorText = await response.text();
                console.error('Login failed:', errorText);
                setErrorLabel("Неверный пароль или логин");
            }
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    };

    return (
        <div>
            <div className="header-bar">
                <img src="../static/images/лого.png" className="header-logo" alt="Логотип" />
            </div>

            <div className="container">
                <div className="login-box">
                    <h1>Вход</h1>
                    <div className="fgf">
                        <form id="loginForm" onSubmit={handleSubmit}>
                            <div>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    placeholder="Логин"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="Пароль"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <h4 id="errorlabel">{errorLabel}</h4>
                            </div>
                            <button type="submit">Войти</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
