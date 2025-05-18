import React, { useEffect, useState, useRef } from 'react';

const ResultsPage = () => {
    const [subjects, setSubjects] = useState([]);
    const [user, setUser] = useState(null);
    const [excellentStudents, setExcellentStudents] = useState([]);
    const [goodStudents, setGoodStudents] = useState([]);
    const [averageStudents, setAverageStudents] = useState([]);
    const [poorStudents, setPoorStudents] = useState([]);
    const [subjectList, setSubjectList] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const canvasRef = useRef(null);

    useEffect(() => {
        // Fetch user data
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
    }, []);

    useEffect(() => {
        if (user) {
            const fetchData = async () => {
                try {
                    // Fetch student statistics
                    const response = await fetch(process.env.REACT_APP_SERVER_URL + 'statistics/student', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify(user)
                    });

                    if (!response.ok) {
                        throw new Error('Ошибка получения данных об успеваемости');
                    }

                    const statisticsData = await response.json();
                    setSubjects(statisticsData);

                    // Fetch subject list
                    const subjectsResponse = await fetch(process.env.REACT_APP_SERVER_URL + 'subject/print-user-subject', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify(user)
                    });

                    if (!subjectsResponse.ok) {
                        throw new Error('Ошибка получения списка предметов');
                    }

                    const subjectsData = await subjectsResponse.json();
                    setSubjectList(subjectsData);

                    if (subjectsData.length > 0) {
                        setSelectedSubject(subjectsData[0].id);
                    }
                } catch (error) {
                    console.error("Error fetching data: ", error);
                }
            };

            fetchData();
        }
    }, [user]);

    useEffect(() => {
        if (selectedSubject && user) {
            const fetchTeacherStats = async () => {
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

                    console.log("Excellent Students:", firstStat.excellentStudents);
                    console.log("Good Students:", firstStat.goodStudents);
                    console.log("Average Students:", firstStat.averageStudents);
                    console.log("Poor Students:", firstStat.poorStudents);
                } catch (error) {
                    console.error("Error fetching teacher stats: ", error);
                }
            };

            fetchTeacherStats();
        }
    }, [selectedSubject, user, subjectList]);

    useEffect(() => {
        // Call drawPieChart whenever the data changes
        if (excellentStudents.length > 0 || goodStudents.length > 0 || averageStudents.length > 0 || poorStudents.length > 0) {
            drawPieChart();
        }
    }, [excellentStudents, goodStudents, averageStudents, poorStudents]);

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

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 3;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;

        // Calculate total number of students
        const totalStudents = excellentStudents.length + goodStudents.length + averageStudents.length + poorStudents.length;

        if (totalStudents === 0) {
            console.error("No students data available");
            return;
        }

        // Calculate percentages
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

            ctx.fillStyle = grade.color;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
            ctx.closePath();
            ctx.fill();

            startAngle += sliceAngle;
        });
    };

    const renderStudentPerformance = () => {
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

    const renderGradeLegend = () => {
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
                            {renderGradeLegend()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;
