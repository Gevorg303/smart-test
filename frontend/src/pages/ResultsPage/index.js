import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import './styles.css';
import { useOutletContext } from 'react-router-dom';

const ResultsPage = () => {
    const [subjects, setSubjects] = useState([]);
    const [topText, setTopText] = useOutletContext();
    const [user, setUser] = useState(null);

    localStorage.setItem('info', "Здесь Вы можете увидеть Ваш средний балл за итоговые тесты по каждому из предметов.");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_SERVER_URL + 'users/current', {
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error('Ошибка получения пользователя');
                }

                const userData = await response.json();
                console.log("User data:", userData);
                setUser(userData);
            } catch (error) {
                console.error('Ошибка получения данных пользователя:', error);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        if (user) {
            const fetchData = async () => {
                try {
                    setTopText("Итоги");

                    // Запрос на получение средних баллов по предметам
                    const response = await fetch(process.env.REACT_APP_SERVER_URL + 'statistics/student', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify(user) // Передаем весь объект пользователя
                    });

                    if (!response.ok) {
                        throw new Error('Ошибка получения данных об успеваемости');
                    }

                    const statisticsData = await response.json();
                    console.log("Statistics data:", statisticsData);

                    // Обновляем состояние subjects данными из сервера
                    setSubjects(statisticsData);
                } catch (error) {
                    console.error("Error fetching data: ", error);
                }
            };

            fetchData();
        }
    }, [user, setTopText]);

    return (
        <div className="page-container">
            <div className="result-container">
                <div className="container-wrapper-2">
                    <div className="container-home-2">
                        {/*<h2>Сведения об успеваемости</h2>*/}
                        <Table className="result-table" striped bordered hover>
                            <thead>
                            <tr>
                                <th>Предмет</th>
                                <th>Средний балл</th>
                            </tr>
                            </thead>
                            <tbody>
                            {subjects.map((subject, index) => (
                                <tr key={index}>
                                    <td>{subject.subject.subjectName}</td>
                                    <td>{subject.score}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;
