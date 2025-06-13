import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useOutletContext } from "react-router-dom";
import './styles.css';
import Spinner from 'react-bootstrap/Spinner';

const ResultsPage = () => {
    const [subjects, setSubjects] = useState([]);
    const [user, setUser] = useState(null);
    const [excellentStudents, setExcellentStudents] = useState([]);
    const [goodStudents, setGoodStudents] = useState([]);
    const [averageStudents, setAverageStudents] = useState([]);
    const [poorStudents, setPoorStudents] = useState([]);
    const [subjectList, setSubjectList] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const canvasRef = useRef(null);
    const [topText, setTopText] = useOutletContext();

    useEffect(() => {
        setTopText("");
        const fetchUser = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_SERVER_URL + 'users/current', {
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error('Ошибка получения пользователя');
                }

                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                console.error('Ошибка получения данных пользователя:', error);
            }
        };

        fetchUser();

        return () => {
            setTopText("");
        };
    }, [setTopText]);

    useEffect(() => {
        if (user) {
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    setTopText("Результаты");

                    const [statisticsResponse, subjectsResponse] = await Promise.all([
                        fetch(process.env.REACT_APP_SERVER_URL + 'statistics/student', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json;charset=UTF-8'
                            },
                            body: JSON.stringify(user)
                        }),
                        fetch(process.env.REACT_APP_SERVER_URL + 'subject/print-user-subject', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json;charset=UTF-8'
                            },
                            body: JSON.stringify(user)
                        })
                    ]);

                    if (!statisticsResponse.ok || !subjectsResponse.ok) {
                        throw new Error('Ошибка получения данных');
                    }

                    const [statisticsData, subjectsData] = await Promise.all([
                        statisticsResponse.json(),
                        subjectsResponse.json()
                    ]);

                    setSubjects(statisticsData);
                    setSubjectList(subjectsData);

                    if (subjectsData.length > 0) {
                        setSelectedSubject(subjectsData[0].id);
                    }
                } catch (error) {
                    console.error("Error fetching data: ", error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchData();
        }
    }, [user]);

    const fetchTeacherStats = useCallback(async () => {
        if (selectedSubject && user) {
            setIsLoading(true);
            try {
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
                const firstStat = teacherStatsData[0] || {};

                setExcellentStudents(firstStat.excellentStudents || []);
                setGoodStudents(firstStat.goodStudents || []);
                setAverageStudents(firstStat.averageStudents || []);
                setPoorStudents(firstStat.poorStudents || []);

            } catch (error) {
                console.error("Error fetching teacher stats: ", error);
            } finally {
                setIsLoading(false);
            }
        }
    }, [selectedSubject, user, subjectList]);

    useEffect(() => {
        fetchTeacherStats();
    }, [fetchTeacherStats]);

    const drawPieChart = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            console.error("Элемент Canvas недоступен");
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error("Не удалось получить контекст холста");
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 3;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;

        const totalStudents = excellentStudents.length + goodStudents.length + averageStudents.length + poorStudents.length;

        if (totalStudents === 0) {
            console.error("Нет данных об учениках");
            return;
        }

        const excellentPercentage = (excellentStudents.length / totalStudents) * 100;
        const goodPercentage = (goodStudents.length / totalStudents) * 100;
        const averagePercentage = (averageStudents.length / totalStudents) * 100;
        const poorPercentage = (poorStudents.length / totalStudents) * 100;

        const gradeData = [
            { label: 'Отлично', percentage: excellentPercentage, color: '#8AC24A' },
            { label: 'Хорошо', percentage: goodPercentage, color: '#9966FF' },
            { label: 'Удовлетворительно', percentage: averagePercentage, color: '#FF9F40' },
            { label: 'Неудовлетворительно', percentage: poorPercentage, color: '#FF6384' },
        ];

        let startAngle = 0;

        gradeData.forEach(grade => {
            const sliceAngle = (grade.percentage / 100) * 2 * Math.PI;
            const midAngle = startAngle + sliceAngle / 2;

            ctx.fillStyle = grade.color;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
            ctx.closePath();
            ctx.fill();

            const labelRadius = radius * 0.6;
            const labelX = centerX + Math.cos(midAngle) * labelRadius;
            const labelY = centerY + Math.sin(midAngle) * labelRadius;

            ctx.fillStyle = '#000';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${grade.percentage.toFixed(1)}%`, labelX, labelY);

            startAngle += sliceAngle;
        });
    }, [excellentStudents, goodStudents, averageStudents, poorStudents]);

    useEffect(() => {
        if (excellentStudents.length > 0 || goodStudents.length > 0 || averageStudents.length > 0 || poorStudents.length > 0) {
            drawPieChart();
        }
    }, [drawPieChart, excellentStudents, goodStudents, averageStudents, poorStudents]);

    const hasData = useMemo(() => {
        return excellentStudents.length > 0 || goodStudents.length > 0 || averageStudents.length > 0 || poorStudents.length > 0;
    }, [excellentStudents, goodStudents, averageStudents, poorStudents]);

    const renderStudentPerformance = useCallback(() => {
        if (!selectedSubject) {
            return <div className="no-subject-selected">Предмет не выбран</div>;
        }

        const lastFivePoorStudents = poorStudents.length > 0
            ? poorStudents.length > 5
                ? poorStudents.slice(-5)
                : [...poorStudents].reverse()
            : [];

        const firstFiveExcellentStudents = excellentStudents.slice(0, 5);
        const firstFiveGoodStudents = goodStudents.slice(0, 5);
        const firstFiveAverageStudents = averageStudents.slice(0, 5);

        return (
            <div className="student-performance">
                <div>
                    <strong>Отлично: </strong>
                    {firstFiveExcellentStudents.length > 0
                        ? firstFiveExcellentStudents.map(student => `${student.name} ${student.surname}`).join(', ')
                        : " Нет данных"}
                </div>
                <div>
                    <strong>Хорошо: </strong>
                    {firstFiveGoodStudents.length > 0
                        ? firstFiveGoodStudents.map(student => `${student.name} ${student.surname}`).join(', ')
                        : " Нет данных"}
                </div>
                <div>
                    <strong>Удовлетворительно: </strong>
                    {firstFiveAverageStudents.length > 0
                        ? firstFiveAverageStudents.map(student => `${student.name} ${student.surname}`).join(', ')
                        : " Нет данных"}
                </div>
                <div>
                    <strong>Неудовлетворительно: </strong>
                    {lastFivePoorStudents.length > 0
                        ? lastFivePoorStudents.map(student => `${student.name} ${student.surname}`).join(', ')
                        : " Нет данных"}
                </div>
            </div>
        );
    }, [selectedSubject, excellentStudents, goodStudents, averageStudents, poorStudents]);

    const renderGradeLegend = useCallback(() => {
        if (!selectedSubject || !hasData) {
            return null;
        }

        return (
            <div className="grade-legend">
                <div>
                    <span className="legend-color" style={{ backgroundColor: '#8AC24A' }}></span>
                    <span>Отлично: {excellentStudents.length} человек</span>
                </div>
                <div>
                    <span className="legend-color" style={{ backgroundColor: '#9966FF' }}></span>
                    <span>Хорошо: {goodStudents.length} человек</span>
                </div>
                <div>
                    <span className="legend-color" style={{ backgroundColor: '#FF9F40' }}></span>
                    <span>Удовлетворительно: {averageStudents.length} человек</span>
                </div>
                <div>
                    <span className="legend-color" style={{ backgroundColor: '#FF6384' }}></span>
                    <span>Неудовлетворительно: {poorStudents.length} человек</span>
                </div>
            </div>
        );
    }, [selectedSubject, hasData, excellentStudents, goodStudents, averageStudents, poorStudents]);

    return (
        <div className="page-container">
            <div className="result-container">
                <div className="container-wrapper-2">
                    <div className="container-home-2">
                        <div className="dropdowns">
                            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                                <option value="">Предмет</option>
                                {subjectList.map((subject, index) => (
                                    <option key={index} value={subject.id}>{subject.subjectName}</option>
                                ))}
                            </select>
                        </div>
                        {isLoading ? (
                            <div className="spinner-container">
                                <Spinner animation="border" variant="dark" style={{ width: '5rem', height: '5rem' }} />
                            </div>
                        ) : (
                            <>
                                {renderStudentPerformance()}
                                {selectedSubject && hasData && (
                                    <div className="chart-and-legend">
                                        <div className="pie-chart-container">
                                            <canvas ref={canvasRef} width="400" height="400"></canvas>
                                        </div>
                                        <div className="grade-labels">
                                            {renderGradeLegend()}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;
