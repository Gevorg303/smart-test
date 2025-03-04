import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import Footer from "../Footer";
import Navbar from "../Navbar";
import './styles.css'; // Импорт CSS файла

const StartTestPage = () => {
    const [testName, setTestName] = useState("");
    const [testDescription, setTestDescription] = useState("");
    const [testTryCount, setTestTryCount] = useState(0);
    const [testDateStart, setTestDateStart] = useState("");
    const [testDateEnd, setTestDateEnd] = useState("");
    const [testTime, setTestTime] = useState("");
    const [attempts, setAttempts] = useState([]);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        timezone: 'UTC',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };


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
                    throw new Error('Ошибка сети');
                }
                const test = await response.json();
                console.log(test);

                setTestName(test.theme.themeName + ": " + test.typeTest.nameOfTestType);
                setTestDescription(test.description || "Описание отсутствует");
                setTestDateStart(new Date(test.openingDateAndTime).toLocaleString("ru", options) );
                setTestDateEnd(new Date(test.closingDateAndTime).toLocaleString("ru", options));
                setTestTime(test.passageTime || "неограничено");
                setTestTryCount(test.numberOfAttemptsToPass||"неограничено")

                // заполнение попыток
                setAttempts(
                    [
                        <tr>
                            <td>1</td>
                            <td>Завершен: среда, 1 января 2025 г. в 00:00</td>
                            <td>3/5</td>
                        </tr>,
                        <tr>
                            <td>2</td>
                            <td>Завершен: четверг, 2 января 2025 г. в 02:00</td>
                            <td>5/5</td>
                        </tr>
                    ]
                )
            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }

        fetchTest();
    }, []);

    let navigate = useNavigate();
    function StartTest() {
     /*  console.log(testDateStart);                                    //проверка отключена!!!
       const now =Date.now().toLocaleString("ru", options);
       if(Date.parse(testDateStart)<=now){
           if(Date.parse(testDateEnd) >= now){
               sessionStorage.setItem('startDate', new Date());*/
               navigate("/test");
      /*     }
           else{
               console.log("Тест больше не доступен для прохождения!")
           }
       }
       else {
            console.log("Тест еще не начался!")
       }*/
    }

    return (
        <div className="page-container">
            <Navbar />
            <div className="content-wrapper">
                <h1 className="test-name">{testName}</h1>
                <div className="test-container">
                    <div className="info-card">
                        <h4 hidden={!testDateStart}>Открыто с: {testDateStart}</h4>
                        <h4 hidden={!testDateEnd}>Закрывается: {testDateEnd}</h4>
                        <h4>Описание: {testDescription}</h4>
                        <h4>Разрешено попыток: {testTryCount}</h4>
                        <h4>Ограничение по времени: {testTime}</h4>
                        <h4>Предыдущие результаты</h4>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>Попытка</th>
                                <th>Состояние</th>
                                <th>Оценка / 5</th>
                            </tr>
                            </thead>
                            <tbody>
                                {attempts}
                            </tbody>
                        </Table>

                        <div className="button-container">
                            <Button onClick={StartTest} className="start-test-button">
                                Начать попытку
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default StartTestPage;
