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
    const [testDateStart, setTestDateStart] = useState(""); // строковое значение
    const [testDateEnd, setTestDateEnd] = useState("");     // строковое значение
    const [testTime, setTestTime] = useState("");
    const [attempts, setAttempts] = useState([]);
    const [testDateStartValue, setTestDateStartValue] = useState(null); // строковое значение
    const [testDateEndValue, setTestDateEndValue] = useState(null);     // строковое значение
    const [typeTest,setTypeTest] = useState(null);
    const [testTheme,setTestTheme] = useState(null);
    const [currentUser,setCurrentUser] = useState(null);

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

    localStorage.setItem('info', "На этой странице вы сможете просмотреть всю информацию по тесту, а также о пройденных попытках");

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
                const response = await fetch('http://localhost:8080/users/current', { //получить пользователя
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
                const user = await response.json();
                setCurrentUser(user);

                const response1 = await fetch('http://localhost:8080/test/id:' + testid);
                if (!response1.ok) {
                    throw new Error('Ошибка сети');
                }
                const test = await response1.json();
                console.log(test);

                setTypeTest(test.typeTest.id);
                setTestTheme(test.theme);
                setTestName(test.theme.themeName + ": " + test.typeTest.nameOfTestType);
                setTestDescription(test.description || "Описание отсутствует");
                setTestDateStart(new Date(test.openingDateAndTime).toLocaleString("ru", options) );
                setTestDateEnd(new Date(test.closingDateAndTime).toLocaleString("ru", options));
                setTestDateStartValue(new Date(test.openingDateAndTime));
                setTestDateEndValue(new Date(test.closingDateAndTime));
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

    async function StartTest() {

        const now =new Date();//.toLocaleString("ru", options);
        if(testDateStartValue<=now){
           if(testDateEndValue >= now){
               sessionStorage.setItem('startDate', new Date());
               if(typeTest === 2){
                   StartTrainingTest();
               }else {
                   navigate("/test");
               }

           }
           else{
               console.log("Тест больше не доступен для прохождения!")
           }
       }
       else {
            console.log("Тест еще не начался!")


        }
    }
    async function StartTrainingTest() {
        let sendData = {
            user:currentUser,
            theme:testTheme
        }
        const response = await fetch('http://localhost:8080/test/create-test-simulator', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(sendData)
        });
        if (!response.ok) {
            throw new Error('Ошибка сети');
        }
        const resJson = await response.json();
        console.log(resJson);
        navigate("/test");
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
                            <Button onClick={() =>{StartTest()}} className="start-test-button">
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
