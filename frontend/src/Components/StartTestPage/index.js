import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
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
                setTestDateStart(test.openingDateAndTime);
                setTestDateEnd(test.closingDateAndTime);
                setTestTime(test.passageTime || "неограничено");
            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }

        fetchTest();
    }, []);

    let navigate = useNavigate();
    function StartTest() {

        navigate("/test");
    }

    return (
        <div className="page-container">
            <Navbar />
            <div className="content-wrapper">
                <h1 className="test-name">{testName}</h1>
                <div className="test-container">
                    <div className="info-card">
                        <h4>{testDescription}</h4>
                        <h4>Ограничение по времени: {testTime}</h4>
                        <h4 hidden={!testDateStart}>Открыто с: {testDateStart}</h4>
                        <h4 hidden={!testDateEnd}>Закрывается: {testDateEnd}</h4>
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
