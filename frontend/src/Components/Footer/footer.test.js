// frontend/src/Components/Footer/footer.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Footer from './index'; // Обновленный путь к компоненту

test('Footer renders correctly', () => {
    render(<Footer />);

    // Проверка, что компонент содержит ожидаемые элементы
    expect(screen.getByRole('heading', { name: /О компании/i })).toBeInTheDocument();
    expect(screen.getByText(/Информация о компании, наша миссия и видение/i)).toBeInTheDocument();

    expect(screen.getByText(/Социальные сети/i)).toBeInTheDocument();
    expect(screen.getByText(/ВКонтакте/i)).toBeInTheDocument();
    expect(screen.getByText(/Telegram/i)).toBeInTheDocument();

    expect(screen.getByText(/Контактная информация/i)).toBeInTheDocument();
    expect(screen.getByText(/Email: info@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Телефон: \+7 \(123\) 456-78-90/i)).toBeInTheDocument();

    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} Ваша Компания. Все права защищены.`, 'i'))).toBeInTheDocument();
});

test('Social media links are disabled', () => {
    render(<Footer />);

    // Проверка, что ссылки на социальные сети не активны
    // eslint-disable-next-line testing-library/no-node-access
    const vkLink = screen.getByText(/ВКонтакте/i).closest('a');
    // eslint-disable-next-line testing-library/no-node-access
    const telegramLink = screen.getByText(/Telegram/i).closest('a');

    expect(vkLink).toHaveAttribute('href', '#');
    expect(telegramLink).toHaveAttribute('href', '#');

    // Проверка, что ссылки имеют класс disabled-link
    expect(vkLink).toHaveClass('disabled-link');
    expect(telegramLink).toHaveClass('disabled-link');
});

test('Social media links are enabled', () => {
    render(<Footer />);

    // Проверка, что ссылки на социальные сети активны
    const vkLink = screen.getByRole('link', { name: /ВКонтакте/i });
    const telegramLink = screen.getByRole('link', { name: /Telegram/i });

    expect(vkLink).toHaveAttribute('href', 'https://vk.com/your_vk_page');
    expect(telegramLink).toHaveAttribute('href', 'https://t.me/your_telegram_page');

    // Проверка, что ссылки не имеют класс disabled-link
    expect(vkLink).not.toHaveClass('disabled-link');
    expect(telegramLink).not.toHaveClass('disabled-link');
});
