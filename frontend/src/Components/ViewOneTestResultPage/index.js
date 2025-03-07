import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import Question from "../Question";
import { useNavigate } from "react-router-dom";
import './styles.css'; // Импортируем CSS-файл
import Navbar from '../Navbar'; // Импортируем компонент Navbar
import Footer from '../Footer'; // Импортируем компонент Footer

const ViewTestResultsPage = (props) => {

    localStorage.setItem('info', "Здесь вы можете просмотреть правильность выполнения теста.");

    const [questions, setQuestions] = useState([]);
    const validList = JSON.parse(`${sessionStorage.getItem("testResult")}`)||[];
    const [answers, setAnswers] = useState(validList.map((item, index) => item.response));
    let ra = 0;
    for (let number = 0; number < validList.length; number++) {
        validList[number].status ? ra++ : ra = ra;
    }
    const [rightAnswers, setRightAnswers] = useState(ra);
    const [text, setText] = useState("");
    const [score, setScore] = useState(0);
    const [countOfQuestions, setCountOfQuestions] = useState(0);
    const [currentPassingScore, setCurrentPassingScore] = useState(60);

    console.log(answers);

    const navigate = useNavigate();

    useEffect(() => {
        function getCookie(name) {
            let matches = document.cookie.match(new RegExp(
                "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ));
            return matches ? decodeURIComponent(matches[1]) : undefined;
        }

        async function fetchTest() {
            try {
                const testid = getCookie("test");
                if(validList.length===0)
                {
                    navigate(-1,{replace:true})
                }
                const response = await fetch('http://localhost:8080/test/id:' + testid);
                if (!response.ok) {
                    throw new Error('Ошибка получения теста');
                }
                const test = await response.json();
                setText(test.theme.themeName + ": " + test.typeTest.nameOfTestType);
                //setCurrentPassingScore(test.passingScore); // проходной балл теста
                const response2 = await fetch('http://localhost:8080/test/get-tasks-test', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify(test)
                });
                if (!response2.ok) {
                    throw new Error("Ошибка получения вопросов");
                }
                const questionsJson = await response2.json();
                setQuestions(questionsJson);
                setCountOfQuestions(questionsJson.length);
                setScore((rightAnswers / questionsJson.length) * 100);
            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }

        fetchTest();

        // Блокировка кнопки возврата
        const handlePopState = (event) => {
            event.preventDefault();
            navigate("/home"); // Перенаправление на страницу home
        };

        window.history.pushState(null, null, window.location.pathname);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);

    function ViewResultsEnd() {
        sessionStorage.clear();
        navigate("/theme");
    }

    return (
        <div>
            <Navbar /> {/* Добавляем компонент Navbar */}
            <div className="content-container"> {/* Добавляем контейнер для контента */}
                <div className="result-container">
                    <h1>{text}</h1>
                    <div>
                        <h2 className="result-title">Ваш результат:</h2>
                        <Table className="result-table">
                            <tbody>
                            <tr>
                                <td>Всего вопросов:</td>
                                <td>{countOfQuestions}</td>
                            </tr>
                            <tr>
                                <td>Баллов:</td>
                                <td> {score} из 100</td>
                            </tr>
                            <tr>
                                <td>Оценка:</td>
                                <td> {score >= 60/*currentPassingScore*/ ? "Зачтено" : "Не зачтено"}</td>
                            </tr>
                            </tbody>
                        </Table>
                        {questions.map((item, index) => (
                            <Question
                                key={index}
                                qStatus={validList[index].status}
                                view
                                id={index}
                                name={questions[index]?.taskName || ""}
                                description={questions[index]?.taskText || ""}
                                answers={answers}
                                setAnswers={setAnswers}
                            />
                        ))}
                        <Button className="result-button" onClick={ViewResultsEnd}>Закончить обзор</Button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ViewTestResultsPage;
