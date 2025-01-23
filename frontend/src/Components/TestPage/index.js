import React, { useEffect, useState } from 'react';
import Question from "../Question";
import { useNavigate } from "react-router-dom";
import { Pagination, Button } from 'react-bootstrap';
import './styles.css';
import Navbar from "../Navbar";
import Footer from "../Footer";

const TestPage = () => {
    let navigate = useNavigate();
    const [active, setActive] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [questions, setQuestions] = useState([]);

    async function TestEnd() {
        let sendData = [];
        questions.map((item, index) => {
            var obj = {};
            obj['task'] = {
                "id": item.id
            };
            obj['response'] = answers[index] || ""
            sendData.push(obj)
        })

        try {
            const response = await fetch('http://localhost:8080/verification/result-test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify(sendData)
            });
            const test = await response.json();
            console.log(test)
            sessionStorage.setItem("testResult", JSON.stringify(test))
        } catch (error) {
            console.error('Ошибка получения данных:', error);
        }
        navigate("/testresult");
    }

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
                if(!testid)
                {
                    navigate(-1,{replace:true})
                }
                const response = await fetch('http://localhost:8080/test/id:' + testid);
                if (!response.ok) {
                    throw new Error('Ошибка получения теста');
                }
                const test = await response.json();
                console.log(test)

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
                setQuestions(questionsJson)
                console.log(questionsJson)
            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }

        fetchTest();
    }, []);

    console.log(answers)
    return (
        <div className="page-container">
            <Navbar />
            <div className="content-wrapper">
                <h1>Контрольный тест</h1>

                    <Question id={active} name={questions[active]?.taskName || ""}
                              description={questions[active]?.taskText || ""} answers={answers}
                              setAnswers={setAnswers}
                               setActive={setActive} qsCount={questions.length} />
                <Pagination>
                    <Pagination.Prev className="pagination-item" hidden={active === 0} onClick={() => {
                        if (active !== 0) setActive(active - 1)
                    }} />
                    <Pagination.Item active className="pagination-item">
                        {active + 1 + " / " + questions.length}
                    </Pagination.Item>
                    <Pagination.Next className="pagination-item" hidden={active >= questions.length - 1} onClick={() => {
                        if (active < questions.length - 1) setActive(active + 1)
                    }} />
                </Pagination>
                <Button className="end-button" onClick={() => TestEnd()}>Завершить тест</Button>

            </div>
            <Footer />
        </div>
    );
};

export default TestPage;
