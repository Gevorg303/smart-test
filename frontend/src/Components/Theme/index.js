import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import './styles.css'; // Импортируйте стили
import { Accordion } from 'react-bootstrap';

const Theme = (props) => {
    const [tests, setTests] = useState([]);
    let navigate = useNavigate();

    const handleClick = (e, id) => {
        e.preventDefault();
        document.cookie = "test=" + id + "; path=/;";
        navigate("/start-test");
    };

    useEffect(() => {
        async function fetchTests() {
            try {
                sessionStorage.clear()
                document.cookie = "test=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
                const response = await fetch(`http://localhost:8080/theme/id:${props.id}`);
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
                const theme = await response.json();
                const response2 = await fetch('http://localhost:8080/test/get-test-id-theme', {
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
                const array = [];
                testsjson.forEach(test => {
                    array.push(
                        <Button
                            key={test.id}
                            className="test-button"
                            onClick={(e) => handleClick(e, test.id)}
                        >
                            {test.typeTest.nameOfTestType}
                        </Button>
                    );
                });
                setTests(array);

            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }
        fetchTests();
    }, [props.id, navigate]);

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
