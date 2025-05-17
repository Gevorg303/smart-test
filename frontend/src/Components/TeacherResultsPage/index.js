import React, { useEffect, useState, useRef } from 'react';
import './styles.css';
import { useOutletContext } from 'react-router-dom';

const ResultsPage = () => {
    const [subjects, setSubjects] = useState([]);
    const [topText, setTopText] = useOutletContext();
    const canvasRef = useRef(null);
    const [user, setUser] = useState(null);
    const [excellentStudents, setExcellentStudents] = useState([]);
    const [goodStudents, setGoodStudents] = useState([]);
    const [averageStudents, setAverageStudents] = useState([]);
    const [poorStudents, setPoorStudents] = useState([]);
    const [subjectList, setSubjectList] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');

    localStorage.setItem('info', "Здесь вы можете увидеть вашу среднюю оценку за предмет");

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

                    // Запрос на получение статистики
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

                    // Запрос на получение списка предметов
                    const subjectsResponse = await fetch(process.env.REACT_APP_SERVER_URL + 'subject/print-user-subject', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify(user) // Передаем объект пользователя
                    });

                    if (!subjectsResponse.ok) {
                        throw new Error('Ошибка получения списка предметов');
                    }

                    const subjectsData = await subjectsResponse.json();
                    console.log("Subjects data:", subjectsData);

                    // Обновляем состояние subjectList данными из сервера
                    setSubjectList(subjectsData);

                    // Устанавливаем первый элемент списка предметов как значение по умолчанию
                    if (subjectsData.length > 0) {
                        setSelectedSubject(subjectsData[0].id);
                    }
                } catch (error) {
                    console.error("Error fetching data: ", error);
                }
            };

            fetchData();
        }
    }, [user, setTopText]);

    useEffect(() => {
        if (selectedSubject && user) {
            const fetchTeacherStats = async () => {
                try {
                    // Запрос на получение данных об отличниках и неуспевающих
                    const teacherStatsResponse = await fetch(process.env.REACT_APP_SERVER_URL + 'statistics/teacher', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify({
                            user: user,
                            subject: subjectList.find(subject => subject.id === parseInt(selectedSubject))
                        })
                    });

                    if (!teacherStatsResponse.ok) {
                        throw new Error('Ошибка получения данных об отличниках и неуспевающих');
                    }

                    const teacherStatsData = await teacherStatsResponse.json();
                    console.log("Teacher statistics data:", teacherStatsData);

                    // Извлекаем данные из первого элемента массива
                    const firstStat = teacherStatsData[0] || {};
                    setExcellentStudents(firstStat.excellentStudents || []);
                    setGoodStudents(firstStat.goodStudents || []);
                    setAverageStudents(firstStat.averageStudents || []);
                    setPoorStudents(firstStat.poorStudents || []);
                } catch (error) {
                    console.error("Error fetching teacher stats: ", error);
                }
            };

            fetchTeacherStats();
        }
    }, [selectedSubject, user, subjectList]);

    useEffect(() => {
        if (subjects.length > 0) {
            drawPieChart();
        }
    }, [subjects]);

    const drawPieChart = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
            console.error("Canvas element is not available");
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error("Could not get canvas context");
            return;
        }

        const centerX = canvas.width / 3; // Смещаем центр влево
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;

        // Группировка данных по оценкам
        const gradeCounts = subjects.reduce((acc, subject) => {
            const grade = subject.score;
            acc[grade] = (acc[grade] || 0) + 1;
            return acc;
        }, {});

        const totalStudents = subjects.length;
        let startAngle = 0;

        // Определение цветов для каждой оценки
        const gradeColors = {
            0: '#8AC24A',
            1: '#9966FF',
            2: '#FF9F40',
            3: '#FFCE56',
            4: '#FF6384',
            5: '#36A2EB'
        };

        // Рисуем диаграмму
        Object.entries(gradeCounts).forEach(([grade, count]) => {
            const sliceAngle = (count / totalStudents) * 2 * Math.PI;
            const color = gradeColors[grade] || '#000000';

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
            ctx.closePath();
            ctx.fill();

            // Подпись на диаграмме
            const middleAngle = startAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(middleAngle) * radius * 0.6;
            const labelY = centerY + Math.sin(middleAngle) * radius * 0.6;
            ctx.fillStyle = '#000000';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${grade} - ${Math.round((count / totalStudents) * 100)}%`, labelX, labelY);

            startAngle += sliceAngle;
        });
    };

    const renderGradeLabels = () => {
        const gradeCounts = subjects.reduce((acc, subject) => {
            const grade = subject.score;
            acc[grade] = (acc[grade] || 0) + 1;
            return acc;
        }, {});

        return (
            <div className="grade-labels">
                {Object.entries(gradeCounts).map(([grade, count]) => (
                    <div key={grade}>
                        Оценка {grade}: {count} человек
                    </div>
                ))}
            </div>
        );
    };

    const renderStudentPerformance = () => {
        console.log("Poor Students Data:", poorStudents); // Логируем данные poorStudents

        // Получаем последние 5 элементов из poorStudents или все, если их меньше 5
        const lastFivePoorStudents = poorStudents.length > 0
            ? poorStudents.length > 5
                ? poorStudents.slice(-5)
                : [...poorStudents].reverse()
            : [];

        console.log("Last Five Poor Students:", lastFivePoorStudents); // Логируем последние 5 элементов

        // Получаем первые 5 элементов из excellentStudents, goodStudents и averageStudents
        const firstFiveExcellentStudents = excellentStudents.slice(0, 5);
        const firstFiveGoodStudents = goodStudents.slice(0, 5);
        const firstFiveAverageStudents = averageStudents.slice(0, 5);

        return (
            <div className="student-performance">
                <div>
                    <strong>Отлично:</strong> {firstFiveExcellentStudents.map(student => `${student.name} ${student.surname}`).join(', ')}
                </div>
                <div>
                    <strong>Хорошо:</strong> {firstFiveGoodStudents.map(student => `${student.name} ${student.surname}`).join(', ')}
                </div>
                <div>
                    <strong>Удовлетворительно:</strong> {firstFiveAverageStudents.map(student => `${student.name} ${student.surname}`).join(', ')}
                </div>
                <div>
                    <strong>Неудовлетворительно:</strong>
                    {lastFivePoorStudents.length > 0
                        ? lastFivePoorStudents.map(student => `${student.name} ${student.surname}`).join(', ')
                        : "Нет данных"}
                </div>
            </div>
        );
    };

    return (
        <div className="page-container">
            <div className="result-container">
                <div className="container-wrapper-2">
                    <div className="container-home-2">
                        <h2>Сведения об успеваемости</h2>
                        <div className="dropdowns">
                            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                                <option value="">Предмет</option>
                                {subjectList.map((subject, index) => (
                                    <option key={index} value={subject.id}>{subject.subjectName}</option>
                                ))}
                            </select>
                        </div>
                        {renderStudentPerformance()}
                        <div className="pie-chart-container">
                            <canvas ref={canvasRef} width="400" height="400"></canvas>
                            <div className="divider"></div>
                            {renderGradeLabels()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;
