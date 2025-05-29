import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import './styles.css';
import { Accordion } from 'react-bootstrap';

const Theme = (props) => {
    const [tests, setTests] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    let navigate = useNavigate();

    const handleClick = (e, id) => {
        e.preventDefault();
        document.cookie = "test=" + id + "; path=/;";
        navigate("/start-test");
    };

    useEffect(() => {
        async function getLastAttempt(testId, userId) {
            try {
                const response = await fetch(process.env.REACT_APP_SERVER_URL + 'test/find-testing-attempt-by-test', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify({
                        user: {
                            id: userId
                        },
                        test: {
                            id: testId
                        }
                    })
                });
                if (!response.ok) {
                    throw new Error('Ошибка получения последней попытки');
                }
                const attemptsJson = await response.json();
                console.log('Attempts JSON:', attemptsJson); // Логирование данных

                if (attemptsJson.length > 0) {
                    const lastAttempt = attemptsJson.reduce((prev, current) => (prev.id > current.id) ? prev : current);
                    console.log('Last Attempt:', lastAttempt); // Логирование последней попытки
                    return lastAttempt;
                }
                return null;
            } catch (error) {
                console.error('Ошибка получения последней попытки:', error);
                return null;
            }
        }

        async function fetchTests() {
            try {
                sessionStorage.clear();
                document.cookie = "test=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
                const response = await fetch(process.env.REACT_APP_SERVER_URL + `theme/id:${props.id}`);
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
                const theme = await response.json();
                const response2 = await fetch(process.env.REACT_APP_SERVER_URL + 'test/get-test-id-theme', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify(theme)
                });
                if (!response2.ok) {
                    throw new Error("Ошибка получения вопросов");
                }
                const testsjson = await response2.json();

                const response3 = await fetch(process.env.REACT_APP_SERVER_URL + 'users/current', {
                    credentials: "include",
                });
                if (!response3.ok) {
                    throw new Error('Ошибка сети');
                }
                const user = await response3.json();

                const testOrder = {
                    'Входной контроль': 1,
                    'Тренажер': 2,
                    'Итоговый тест': 3
                };

                const sortedTests = testsjson.sort((a, b) => {
                    return testOrder[a.typeTest.nameOfTestType] - testOrder[b.typeTest.nameOfTestType];
                });

                const arrayScoresForTest = []
                for await (const testForBlock of sortedTests)  {
                    const lastAttempt = await getLastAttempt(testForBlock.id, user.id);
                    const type = testForBlock.typeTest.id;

                    switch (type)
                    {
                        case 1:
                            arrayScoresForTest[0] = lastAttempt? lastAttempt.testResult : 0;
                            break;
                        case 2:
                            arrayScoresForTest[1] = lastAttempt? lastAttempt.testResult: 0;
                            break;
                        case 3:
                            arrayScoresForTest[2] = lastAttempt? lastAttempt.testResult: 0;
                            break;
                    }
                }
                //console.log('Scores:', arrayScoresForTest);
                const array = sortedTests.map((test, index) => {
                    const testType = test.typeTest.nameOfTestType;
                    const isDisabled =
                        (testType === 'Тренажер' && arrayScoresForTest[0] === 0) ||
                        (testType === 'Итоговый тест' && (arrayScoresForTest[1] === 0 || arrayScoresForTest[1] < test.passThreshold));

                    //console.log(`Test Type: ${testType}, Scores: ${arrayScoresForTest}, Is Disabled: ${isDisabled}`); // Логирование логики

                    return (
                        <Button
                            key={test.id}
                            className="test-button"
                            onClick={(e) => handleClick(e, test.id)}
                            disabled={isDisabled}
                        >
                            {testType}
                        </Button>
                    );
                });

                setTests(array);

            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }

        fetchTests();
    }, [props.id]);

    return (
        <div className="accordion">
            <Accordion defaultActiveKey="1">
                <Accordion.Item eventKey="0">
                    <Accordion.Header><h2>{props.themeName}</h2></Accordion.Header>
                    <Accordion.Body>
                        <div className="buttons-container">
                            {tests}
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    );
};

export default Theme;
