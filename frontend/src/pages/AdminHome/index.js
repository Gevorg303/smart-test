import React, { useEffect, useState, useRef } from 'react';
import { useOutletContext } from "react-router-dom";
import { Table } from "react-bootstrap";
import "./styles.css";

const AdminHome = () => {
    const [subjects, setSubjects] = useState([]);
    const [roleCounts, setRoleCounts] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [classStudentCounts, setClassStudentCounts] = useState({});
    const [topText, setTopText] = useOutletContext();
    const canvasRef = useRef(null);
    const [user, setUser] = useState(null);

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

        // Очистка topText при размонтировании компонента
        return () => {
            setTopText("");
        };
    }, [setTopText]);

    useEffect(() => {
        if (user) {
            const fetchData = async () => {
                try {
                    setTopText("Домашняя страница админа");

                    const userCountResponse = await fetch(process.env.REACT_APP_SERVER_URL + 'statistics/admin-count-user', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify(user)
                    });

                    if (!userCountResponse.ok) {
                        const errorData = await userCountResponse.json();
                        throw new Error(`Ошибка получения данных пользователей: ${userCountResponse.status} - ${JSON.stringify(errorData)}`);
                    }

                    const userCountData = await userCountResponse.json();
                    console.log("User count data:", userCountData);

                    const counts = userCountData.map(item => `${item.role.role}: ${item.count}`);
                    setRoleCounts(counts);
                    setTotalUsers(userCountData.reduce((sum, item) => sum + item.count, 0));

                    const classCountResponse = await fetch(process.env.REACT_APP_SERVER_URL + 'statistics/admin-count-student-class', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify(user)
                    });

                    if (!classCountResponse.ok) {
                        const errorData = await classCountResponse.json();
                        throw new Error(`Ошибка получения данных учеников: ${classCountResponse.status} - ${JSON.stringify(errorData)}`);
                    }

                    const classCountData = await classCountResponse.json();
                    console.log("Class count data:", classCountData);

                    const classCounts = classCountData.reduce((acc, item) => {
                        const className = `${item.studentClassDtoList.numberOfInstitution} ${item.studentClassDtoList.letterDesignation}`;
                        acc[className] = item.countStudentClass;
                        return acc;
                    }, {});

                    setClassStudentCounts(classCounts);

                    const mockData = [
                        { name: "Илья", role: "Админ", class: " " },
                        { name: "Петя", role: "Админ", class: " " },
                        { name: "Максим", role: "Ученик", class: "3 Б" },
                        { name: "Саша", role: "Ученик", class: "1 А"},
                        { name: "Миша", role: "Ученик", class: "1 А" },
                        { name: "Паша", role: "Учитель", class: " " },
                    ];

                    setSubjects(mockData);
                } catch (error) {
                    console.error("Error fetching data: ", error);
                    alert("Ошибка при получении данных: " + error.message);
                }
            };

            fetchData();
        }
    }, [user, setTopText]);

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
        <div className={"all-container-admin"}>
            <div className="page-container">
                <div className="result-container">
                    <div className="container-wrapper-2">
                        <div className="container-home-2">
                            <div className="HeadText">
                            <h2>Сведения о пользователях</h2>
                            </div>
                            <div>
                                <h3>Количество пользователей по ролям:</h3>
                                <ul>
                                    {roleCounts.map((roleCount, index) => (
                                        <li key={index}>{roleCount}</li>
                                    ))}
                                </ul>
                                <p>Общее количество пользователей: {totalUsers}</p>
                            </div>
                            <div className="bar-chart-container">
                                <h3>Количество учеников в классах</h3>
                                <div className="scroll-container">
                                    <div className="chart-wrapper">
                                        <canvas ref={canvasRef} width={Object.keys(classStudentCounts).length * 70} height="300"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
