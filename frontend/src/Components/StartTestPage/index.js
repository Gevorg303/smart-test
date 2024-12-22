import React from 'react';
import {Button} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import ResultTable from "../ResultTable";

const StartTestPage = () => {

    let testName ="Название теста";
    let testDescription ="Описание теста";
    let testTryCount = 2;
    let testTime = "30 мин."
    let testDateStart = "пятница, 15 декабря 2000, 00:00"
    let testDateEnd = "четверг, 25 декабря 2000, 11:00"


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
            <h4>Открыто с: {testDateStart}</h4>
            <h4>Закрывается: {testDateEnd}</h4>
            <ResultTable tryCount={2} />

            <Button onClick={()=>{StartTest()}}>Начать попытку</Button>
        </div>
    );
};

export default StartTestPage;