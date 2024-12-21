import React from 'react';
import {Button,Table} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const StartTestPage = () => {
    let navigate = useNavigate();
    function StartTest()
    {
        //
        navigate("/test");
    }
    return (
        <div className="container">
            <h1>Название теста</h1>
            <h4>Описание теста Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.</h4>
            <h4>Количество попыток: 2</h4>
            <h4>Ограничение по времени: 30 мин.</h4>
            <h4>Открыто с: пятница, 15 декабря 2000, 00:00</h4>
            <h4>Закрывается: четверг, 25 декабря 2000, 11:00</h4>
            <h2>Результаты ваших предыдущих попыток</h2>
            <Table>
                <thead>
                <td>Попытка</td>
                <td>Оценка</td>
                <td>Просмотр</td>
                </thead>
                <tr>
                    <td>1</td>
                    <td>33/100</td>
                    <td><Button>Просмотр</Button></td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>66/100</td>
                    <td><Button>Просмотр</Button></td>
                </tr>
            </Table>

            <Button onClick={()=>{StartTest()}}>Начать попытку</Button>
        </div>
    );
};

export default StartTestPage;