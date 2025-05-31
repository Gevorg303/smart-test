// src/Components/ProfilePage/ProfilePage.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import ProfilePage from './index'; // Обновленный путь к компоненту

// Мок для useNavigate
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

// Мок для fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
            name: 'Вася',
            surname: 'Пупкин',
            patronymic: 'Олегович',
            login: 'VPOlegovich11',
            role: { role: 'Учитель' },
            email: 'example@mail.ru',
            id: 1
        }),
    })
);

test('ProfilePage renders correctly', async () => {
    render(
        <Router>
            <ProfilePage />
        </Router>
    );

    // Ожидание обновления DOM
    await waitFor(() => {
        // Проверка уникальных текстов
        expect(screen.getByAltText(/Портрет/i)).toBeInTheDocument();
        expect(screen.getByText(/Информация о пользователе/i)).toBeInTheDocument();

        // eslint-disable-next-line testing-library/no-node-access
        expect(screen.getByText(/Имя:/i)).toBeInTheDocument();
        expect(screen.getByText(/Вася/i)).toBeInTheDocument();

        expect(screen.getByText(/Фамилия:/i)).toBeInTheDocument();
        expect(screen.getByText(/Пупкин/i)).toBeInTheDocument();

        expect(screen.getByText(/Отчество:/i)).toBeInTheDocument();
        expect(screen.getByText(/Олегович/i)).toBeInTheDocument();

        expect(screen.getByText(/Логин:/i)).toBeInTheDocument();
        expect(screen.getByText(/VPOlegovich11/i)).toBeInTheDocument();

        expect(screen.getByText(/Статус:/i)).toBeInTheDocument();
        expect(screen.getByText(/Учитель/i)).toBeInTheDocument();

        expect(screen.getByText(/Электронная почта:/i)).toBeInTheDocument();
        expect(screen.getByText(/example@mail.ru/i)).toBeInTheDocument();

        expect(screen.getByText(/Выйти из аккаунта/i)).toBeInTheDocument();
    });
});


test('Logout button redirects to login page', async () => {
    const mockNavigate = jest.fn();
    const useNavigateMock = require('react-router-dom').useNavigate;

    // Установить поведение мока
    useNavigateMock.mockImplementation(() => mockNavigate);

    render(
        <Router>
            <ProfilePage />
        </Router>
    );

    // Ожидание обновления DOM
    await waitFor(() => {
        // Нажатие на кнопку выхода
        const logoutButton = screen.getByText(/Выйти из аккаунта/i);
        fireEvent.click(logoutButton);
    });

    // Проверка вызова mockNavigate
    expect(mockNavigate).toHaveBeenCalledWith('/');
});
