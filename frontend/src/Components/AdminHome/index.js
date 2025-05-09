import React, { useEffect, useState, useRef } from 'react';
import { useOutletContext } from "react-router-dom";
import { Table } from "react-bootstrap";

const AdminHome = ({ userId }) => {
    const [subjects, setSubjects] = useState([]);
    const [roleCounts, setRoleCounts] = useState({});
    const [totalUsers, setTotalUsers] = useState(0);
    const [classStudentCounts, setClassStudentCounts] = useState({});
    const [topText, setTopText] = useOutletContext();
    const canvasRef = useRef(null);

    localStorage.setItem('info', "Здесь вы можете увидеть вашу среднюю оценку за предмет");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setTopText("Домашняя страница админа");
                // Пример данных, которые вы получите из БД
                const mockData = [
                    { name: "Илья", role: "Админ",  class: " " },
                    { name: "Петя", role: "Админ",  class: " " },
                    { name: "Максим", role: "Ученик",  class: "3 Б" },
                    { name: "Саша", role: "Ученик",  class: "1 А"},
                    { name: "Миша", role: "Ученик", class: "1 А" },
                    { name: "Паша", role: "Учитель",  class: " " },
                ];

                setSubjects(mockData);

                // Подсчет количества пользователей каждой роли
                const counts = mockData.reduce((acc, subject) => {
                    acc[subject.role] = (acc[subject.role] || 0) + 1;
                    return acc;
                }, {});

                setRoleCounts(counts);
                setTotalUsers(mockData.length);

                // Подсчет количества учеников в каждом классе
                const classCounts = mockData.reduce((acc, subject) => {
                    if (subject.role === "Ученик" && subject.class.trim() !== "") {
                        acc[subject.class] = (acc[subject.class] || 0) + 1;
                    }
                    return acc;
                }, {});

                setClassStudentCounts(classCounts);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, [userId, setTopText]);

    useEffect(() => {
        if (Object.keys(classStudentCounts).length > 0) {
            drawBarChart();
        }
    }, [classStudentCounts]);

    const drawBarChart = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const labels = Object.keys(classStudentCounts);
        const data = Object.values(classStudentCounts);

        const barWidth = 50;
        const spacing = 20;
        const maxBarHeight = 200;
        const maxDataValue = Math.max(...data);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        data.forEach((value, index) => {
            const barHeight = (value / maxDataValue) * maxBarHeight;
            const x = index * (barWidth + spacing) + spacing;
            const y = canvas.height - barHeight - 20;

            ctx.fillStyle = 'rgba(75, 192, 192, 0.6)';
            ctx.fillRect(x, y, barWidth, barHeight);

            ctx.fillStyle = '#000';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(labels[index], x + barWidth / 2, canvas.height - 5);
            ctx.fillText(value, x + barWidth / 2, y - 5);
        });
    };

    return (
        <div className="page-container">
            <div className="result-container">
                <div className="container-wrapper-2">
                    <div className="container-home-2">
                        <h2>Сведения об успеваемости</h2>
                        <div>
                            <h3>Количество пользователей по ролям:</h3>
                            <ul>
                                {Object.entries(roleCounts).map(([role, count]) => (
                                    <li key={role}>{role}: {count}</li>
                                ))}
                            </ul>
                            <p>Общее количество пользователей: {totalUsers}</p>
                        </div>
                        <div className="bar-chart-container">
                            <h3>Количество учеников в классах</h3>
                            <canvas ref={canvasRef} width="400" height="300"></canvas>
                        </div>
                        <Table className="result-table" striped bordered hover>
                            <thead>
                            <tr>
                                <th>Имя</th>
                                <th>Роль</th>
                            </tr>
                            </thead>
                            <tbody>
                            {subjects.map((subject, index) => (
                                <tr key={index}>
                                    <td>{subject.name}</td>
                                    <td>{subject.role}</td>
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

export default AdminHome;
