import React from 'react';
import {Button} from 'react-bootstrap';

const StartTestPage = () => {
    return (
        <div className="container">
            <h1>Название теста</h1>
            <h4>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.</h4>
            <h4>Количество попыток: 2</h4>
            <h4>Ограничение по времени: 30 мин.</h4>
            <h4>Открыто с: пятница, 15 декабря 2000, 00:00</h4>
            <h4>Закрывается: четверг, 25 декабря 2000, 11:00</h4>
            <Button>Начать попытку</Button>
        </div>
    );
};

export default StartTestPage;