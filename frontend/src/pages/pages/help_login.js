import React from 'react';
import './helpLogin.css';

const HelpLogin = () => {
    const handleBack = () => {
        window.location.href = '/login'; // Переход на страницу входа
    };

    return (
        <div className="help-container">
            <p>Введите здесь данные, которые выдал Вам ваш классный руководитель</p>
            <button type="button" onClick={handleBack}>Вернуться назад</button>
        </div>
    );
};

export default HelpLogin;
