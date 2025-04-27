import React, { useEffect, useState } from 'react';
import Question from "../Question";
import { useNavigate } from "react-router-dom";
import { Pagination, Button } from 'react-bootstrap';
import './styles.css';
import Navbar from "../Navbar";
import Footer from "../Footer";
import TestTimer from "../TestTimer";
import { useOutletContext } from 'react-router-dom';

const TestPage = () => {
    let navigate = useNavigate();

   // const startDateTime =  new Date();
    const [active, setActive] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [attemptData, setAttemptData] = useState([]);

  //  const [test, setTest] = useState();
 //   const [user, setUser] = useState();
    const [attemptDuration, setAttemptDuration] = useState();
    const [startDateTime, setStartDateTime] = useState(new Date(sessionStorage.getItem('startDate')));

    const [timer, setTimer] = useState();
    const [topText, setTopText] = useOutletContext();

    localStorage.setItem('info', "Это тест с последовательным порядком выведения заданий. Можно пропускать и возвращаться к пропущенным заданиям. По выполнению всех заданий завершите тест");


    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    async function TestEnd() {
        console.log(questions)
        console.log(answers)
       // let requestForTaskList =[];

        answers.map((item, index) => {
            item.task = questions.find(elem => elem.id === item.task.id);

        })

        let sec = attemptDuration % 60;
        let min = Math.floor(parseInt(attemptDuration)/60%60) ;
        let hour= Math.floor(parseInt(attemptDuration)/3600) ;

        const response1 = await fetch('http://localhost:8080/users/current', { //получить пользователя
            credentials: "include",
        });
        if (!response1.ok) {
            throw new Error('Ошибка сети');
        }
        const user = await response1.json();

        let testId = parseInt(getCookie("test"),10);

        let sendData = {
            "startDateTime": startDateTime.toISOString(),
            "attemptDuration": (hour < 10?"0"+hour:hour) + ":"+(min < 10?"0"+min:min) + ":"+(sec<10?"0"+sec:sec),
            "test": {
                "id": testId
            },
            "user": {
                "id": user.id
            },
            "requestForTaskList": answers
        }
        console.log(sendData)

        try {
            const response = await fetch('http://localhost:8080/test/end-testing', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify(sendData)
            });
            const resJson = await response.json();
            setAttemptData(resJson);
            console.log(resJson)
            sessionStorage.setItem("testResult", JSON.stringify(resJson))
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
                const passTime = test.passageTime.split(':');
                console.log(passTime);

                if(passTime != null ){
                    setTimer(<TestTimer durationHour={parseInt(passTime[0])} durationMin={parseInt(passTime[1])} durationSec={parseInt(passTime[2])} functionOnEnd={TestEnd} start={true} timeFromStart={setAttemptDuration}/>)
                }


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
                setTopText("Контрольный тест");
            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }

        fetchTest();
    }, [setTopText]);

    //console.log(answers)
    return (
        <div className="page-container">
            <div className="content-wrapper">
                {/*Контрольный тест</h1>*/}
                {timer}
                    <Question id={active} item={questions[active]} answers={answers}
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
                <Button hidden={active+1!=questions.length?"hidden":""}  className="end-button" onClick={() => TestEnd()}>Завершить тест</Button>

            </div>
            {/*<Footer />*/}
        </div>
    );
};

export default TestPage;
