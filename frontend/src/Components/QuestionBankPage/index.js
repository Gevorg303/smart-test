import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import BankCard from "../BankCard";
import "./styles.css";
import Navbar from "../Navbar";
import Footer from "../Footer";

const QuestionBankPage = () => {
    const [isTests, setIsTests] = useState(true);
    const [tests, setTests] = useState([]);
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        async function fetchTests() {
            try {
                document.cookie = "sub=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
                document.cookie = "test=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
                const response1 = await fetch('http://localhost:8080/users/current', {
                    credentials: "include",
                });
                if (!response1.ok) {
                    throw new Error('Ошибка сети');
                }
                const user = await response1.json();

                const response2 = await fetch('http://localhost:8080/test/get-user-tests', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify(user)
                });
                if (!response2.ok) {
                    throw new Error('Ошибка получения теста');
                }
                const tests = await response2.json();
                console.log(tests)
                setTests(tests)

                const response3 = await fetch('http://localhost:8080/task/get-user-tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify(user)
                });
                if (!response3.ok) {
                    throw new Error('Ошибка получения теста');
                }
                const questions = await response3.json();
                console.log(questions)
                setQuestions(questions)

            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }

        fetchTests();
    }, []);

    return (
        <div>
            <Navbar/>
            <br/><br/><br/>
            <h1>{isTests ? "Тесты" : "Вопросы"}</h1>
            <div className="page-container-quest">

                <div className="button-container-quest">
                    <Button className="button-quest" onClick={() => {
                        setIsTests(true)
                    }}>Тесты</Button>
                    <Button className="button-quest" onClick={() => {
                        setIsTests(false)
                    }}>Вопросы</Button>
                </div>
                {isTests ? tests.map((item, index) => <BankCard key={index} id={index} obj={item}
                                                                isTest={isTests}/>) : questions.map((item, index) =>
                    <BankCard key={index} id={index} obj={item} isTest={isTests}/>)}
            </div>
            <Footer/>
        </div>
    );
};

export default QuestionBankPage;
