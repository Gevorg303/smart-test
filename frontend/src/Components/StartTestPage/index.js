import React, {useEffect, useState} from 'react';
import {Button} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import ResultTable from "../ResultTable";
import SubjectCard from "../SubjectCard";

const StartTestPage = () => {

    const [testName,setTestName] = useState("Тема: Тип теста");
    const [testDescription,setTestDescription] = useState("Описание теста");
    const [testTryCount,setTestTryCount] = useState(2);
    const [testDateStart,setTestDateStart] = useState("пятница, 15 декабря 2000, 00:00");
    const [testDateEnd,setTestDateEnd] = useState("четверг, 25 декабря 2000, 11:00");
    const [testTime,setTestTime] = useState("30 мин.");

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
                const response = await fetch('http://localhost:8080/test/id:'+testid);
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
                const test = await response.json();
                console.log(test)
                setTestName(test.theme.themeName + ": " + test.typeTest.nameOfTestType);
                setTestDescription(test.description|| "Описание отсутсвует");
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
    function StartTest()
    {
        //
        navigate("/test");
    }
    return (
        <div className="container">
            <h1>{testName}</h1>
            <h4>{testDescription}</h4>
            <h4>Ограничение по времени: {testTime}</h4>
            <h4 hidden={!testDateStart}>Открыто с: {testDateStart}</h4>
            <h4 hidden={!testDateEnd}>Закрывается: {testDateEnd}</h4>
            {/* <ResultTable tryCount={2} />*/}

            <Button onClick={()=>{StartTest()}}>Начать попытку</Button>
        </div>
    );
};

export default StartTestPage;