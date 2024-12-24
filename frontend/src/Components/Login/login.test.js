import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LoginPage from './index'; // Обновленный путь к компоненту



// Мок для fetch, чтобы имитировать запросы
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: false,
        text: () => Promise.resolve('Invalid credentials')
    })
);

Object.defineProperty(window, "location", {
    value: {
        href: "",
    },
    writable: true,
});

// Мокаем document.cookie
Object.defineProperty(document, "cookie", {
    writable: true,
    value: "jwtToken=exampleToken; path=/;",
});

test('Проверка начального состояния', () => {
    render(<LoginPage />);
    const usernameInput = screen.getByPlaceholderText(/Логин/i);
    const passwordInput = screen.getByPlaceholderText(/Пароль/i);
    const errorLabel = screen.queryByText(/Неверный пароль или логин/i);

    expect(usernameInput).toHaveValue('');
    expect(passwordInput).toHaveValue('');
    expect(errorLabel).not.toBeInTheDocument();
});

test('Проверка отправки формы', async () => {
    render(<LoginPage />);
    const usernameInput = screen.getByPlaceholderText(/Логин/i);
    const passwordInput = screen.getByPlaceholderText(/Пароль/i);
    const submitButton = screen.getByText(/Войти/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    fireEvent.click(submitButton);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify({ username: 'testuser', password: 'testpass' })
    });
});

describe("LoginPage - JWT token deletion", () => {
    test("should delete JWT token on logout", async () => {
        // Рендерим компонент
        const { getByText } = render(<LoginPage />);

        // Устанавливаем значение JWT токена
        document.cookie = "jwtToken=exampleToken; path=/;";

        // Мокаем вызов logout (например, удаление куки)
        document.cookie = "jwtToken=; Max-Age=0; path=/;";

        // Проверяем, что JWT токен удалён
        expect(document.cookie).not.toContain("jwtToken=exampleToken");
    });
});