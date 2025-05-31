import React, { useEffect, useState } from 'react';
import { Button, Table, Toast } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import Footer from "../Footer";
import Navbar from "../Navbar";
import './styles.css';
import TestAttemptsDisplay from "../TestAttemptsDisplay"; // Импорт CSS файла
import { useOutletContext } from 'react-router-dom';

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
    const [typeTest, setTypeTest] = useState(null);
    const [testTheme, setTestTheme] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [topText, setTopText] = useOutletContext();
    const [testTask, setTestTaskCount] = useState([]);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccessToast, setShowSuccessToast] = useState(false);

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
                if (!testid) {
                    navigate(-1, { replace: true })
                }
                const response = await fetch(process.env.REACT_APP_SERVER_URL+'users/current', { //получить пользователя
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
                const user = await response.json();
                setCurrentUser(user);

                const response1 = await fetch(process.env.REACT_APP_SERVER_URL+'test/id:' + testid);
                if (!response1.ok) {
                    throw new Error('Ошибка сети');
                }
                const test = await response1.json();
                console.log(test);

                const response2 = await fetch(process.env.REACT_APP_SERVER_URL+'test/find-testing-attempt-by-test', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify(
                        {
                            user: {
                                id: user.id
                            },
                            test: {
                                id: test.id
                            }
                        }
                    )
                });
                if (!response2.ok) {
                    throw new Error('Ошибка сети');
                }
                const attemptsJson = await response2.json();
                console.log(attemptsJson);
                setAttempts(attemptsJson)

                const response3 = await fetch(process.env.REACT_APP_SERVER_URL+'test/get-tasks-test', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify(test)
                });
                if (!response3.ok) {
                    throw new Error("Ошибка получения вопросов");
                }
                const questionsJson = await response3.json();
                setTestTaskCount(questionsJson)
                // console.log(questionsJson.length)

                setTypeTest(test.typeTest.id);
                setTestTheme(test.theme);
                setTestName(test.theme.themeName + ": " + test.typeTest.nameOfTestType);
                setTestDescription(test.description || "Описание отсутствует");
                setTestDateStart(new Date(test.openingDateAndTime).toLocaleString("ru", options));
                setTestDateEnd(new Date(test.closingDateAndTime).toLocaleString("ru", options));
                setTestDateStartValue(new Date(test.openingDateAndTime));
                setTestDateEndValue(new Date(test.closingDateAndTime));
                setTestTime(test.passageTime || "неограничено");
                setTestTryCount(test.numberOfAttemptsToPass || "неограничено")

                setTopText(test.theme.themeName + ": " + test.typeTest.nameOfTestType);
                // заполнение попыток
                /* setAttempts(
                     [
                         {
                             id: 1,
                             date: "Завершен: среда, 1 января 2025 г. в 00:00",
                             score: "3/5"
                         },
                         {
                         id: 2,
                         date: "Завершен: четверг, 2 января 2025 г. в 02:00",
                         score: "5/5"
                         }
                     ]
                 )*/
            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }

        fetchTest();
    }, [setTopText]);

    let navigate = useNavigate();

    const ErrorToast = (message) => {
        setErrorMessage(message);
        setShowErrorToast(true);
    };

    async function StartTest() {
        // Проверка, что количество попыток больше или равно количеству сделанных попыток
        if (attempts.length < testTryCount) {
            // Проверка наличия заданий в тесте
            if (testTask.length != 0 || (typeTest == 2 && testTask.length == 0)) {
                const now = new Date();
                // Проверка, что тест уже начался
                if (testDateStartValue <= now) {
                    // Проверка, что тест еще не закончился
                    if (testDateEndValue >= now) {
                        sessionStorage.setItem('startDate', new Date());
                        if (typeTest === 2) {
                            StartTrainingTest();
                        } else {
                            sessionStorage.setItem("tasksForTest",JSON.stringify(testTask))
                            console.log(testTask)
                            navigate("/test");
                        }
                    } else {
                        ErrorToast("Тест больше не доступен для прохождения!");
                    }
                } else {
                    ErrorToast("Тест еще не начался!");
                }
            } else {
                ErrorToast("В тесте отсутствуют задания!");
            }
        } else {
            ErrorToast("Количество попыток исчерпано!");
        }
    }

    async function StartTrainingTest() {
        let sendData = {
            user: currentUser,
            theme: testTheme
        }
        const response = await fetch(process.env.REACT_APP_SERVER_URL+'test/create-test-simulator', {
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
        if(resJson.length > 0){
            console.log(resJson);
            sessionStorage.setItem("tasksForTest",JSON.stringify(resJson))
            navigate("/test");
        } else {
            ErrorToast("Отсутсвуют задания для тренировки!");
        }

    }

    return (
        <div className="page-container">
            <div className="content-wrapper">
                <div className="test-container">
                    <div className="info-card">
                        <h4 hidden={!testDateStart}>Открыто с: {testDateStart}</h4>
                        <h4 hidden={!testDateEnd}>Закрывается: {testDateEnd}</h4>
                        <h4>Описание: {testDescription}</h4>
                        <h4>Разрешено попыток: {testTryCount}</h4>
                        <h4>Ограничение по времени: {testTime}</h4>
                        <h4>Предыдущие результаты</h4>
                        <TestAttemptsDisplay attempts={attempts} />

                        <div className="button-container">
                            <Button onClick={() => { StartTest() }} className="start-test-button">
                                Начать попытку
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {showErrorToast && (
                <Toast
                    onClose={() => setShowErrorToast(false)}
                    show={showErrorToast}
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        zIndex: 100000,
                        backgroundColor: showSuccessToast ? 'green':'red',
                        color: 'white'
                    }}
                >
                    <Toast.Header closeButton={false}>
                        <strong className="mr-auto">Успешно</strong>
                        <Button variant="light" onClick={() => setShowErrorToast(false)} style={{ marginLeft: 'auto', width: '15%' }}>
                            {/*&times;*/} x
                        </Button>
                    </Toast.Header>
                    <Toast.Body>{showSuccessToast ? 'Успешно': errorMessage}</Toast.Body>
                </Toast>
            )}
        </div>
    );
};

export default StartTestPage;
