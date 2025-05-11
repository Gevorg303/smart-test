import React, { useEffect, useState, useRef } from 'react';
import './styles.css';
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useOutletContext } from 'react-router-dom';

const ResultsPage = ({ userId }) => {
    const [subjects, setSubjects] = useState([]);
    const [topText, setTopText] = useOutletContext();
    const canvasRef = useRef(null);

    localStorage.setItem('info', "Здесь вы можете увидеть вашу среднюю оценку за предмет");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setTopText("Итоги");
                setSubjects([
                    { name: "Илья", average: 4 },
                    { name: "Петя", average: 5 },
                    { name: "Максим", average: 4 },
                    { name: "Саша", average: 3 },
                    { name: "Миша", average: 3 },
                    { name: "Паша", average: 4 }
                ]);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, [userId, setTopText]);

    useEffect(() => {
        if (subjects.length > 0) {
            drawPieChart();
        }
    }, [subjects]);

    const drawPieChart = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 3; // Смещаем центр влево
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;

        // Группировка данных по оценкам
        const gradeCounts = subjects.reduce((acc, subject) => {
            const grade = subject.average;
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
            const grade = subject.average;
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

    const renderTopAndBottomStudents = () => {
        const sortedStudents = [...subjects].sort((a, b) => b.average - a.average);
        const topStudents = sortedStudents.slice(0, 5);
        const bottomStudents = sortedStudents.slice(-5);

        return (
            <div className="student-performance">
                <div>
                    <strong>Отличники:</strong> {topStudents.map(student => student.name).join(', ')}
                </div>
                <div>
                    <strong>Неуспевающие:</strong> {bottomStudents.map(student => student.name).join(', ')}
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
                            <select>
                                <option value="">Класс</option>
                                <option value="class1">Класс 1</option>
                                <option value="class2">Класс 2</option>
                            </select>
                            <select>
                                <option value="">Предмет</option>
                                <option value="subject1">Предмет 1</option>
                                <option value="subject2">Предмет 2</option>
                            </select>
                            <select>
                                <option value="">Тема</option>
                                <option value="topic1">Тема 1</option>
                                <option value="topic2">Тема 2</option>
                            </select>
                        </div>
                        {renderTopAndBottomStudents()}
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
