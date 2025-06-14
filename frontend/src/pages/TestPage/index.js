import React, { useEffect, useState } from 'react';
import Question from "../../Components/TestingModule/Question";
import { useNavigate } from "react-router-dom";
import { Pagination, Button } from 'react-bootstrap';
import './styles.css';
import Navbar from "../../Components/UIModule/Navbar";
import Footer from "../../Components/UIModule/Footer";
import TestTimer from "../../Components/TestingModule/TestTimer";
import { useOutletContext } from 'react-router-dom';

const TestPage = () => {
    let navigate = useNavigate();

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

    localStorage.setItem('info', "Это тест с последовательным порядком вывода заданий. Задания можно пропускать и возвращаться к ним. По выполнению всех заданий нажмите на кнопку 'Завершить тест'.");

    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    async function TestEnd(attemptDurationTime) {
        console.log(questions)
        console.log(answers)
       // let requestForTaskList =[];

        answers.map((item, index) => {
            item.task = questions.find(elem => elem.id === item.task.id);
        })
        questions.map((item, index) => {
            const findAnswer = answers.find(elem => elem.task.id === item.id);
            if(findAnswer == undefined){
                answers.push({
                    responseOption:[],
                    task: item
                });
            }
        })
        console.log(attemptDurationTime)
        let sec = attemptDurationTime.getSeconds();
        let min = attemptDurationTime.getMinutes();//Math.floor(parseInt(attemptDuration)/60%60) ;
        let hour= attemptDurationTime.getHours();//Math.floor(parseInt(attemptDuration)/3600) ;

        const response1 = await fetch(process.env.REACT_APP_SERVER_URL+'users/current', { //получить пользователя
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
            const response = await fetch(process.env.REACT_APP_SERVER_URL+'test/end-testing', {
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
                const response = await fetch(process.env.REACT_APP_SERVER_URL+'test/id:' + testid);
                if (!response.ok) {
                    throw new Error('Ошибка получения теста');
                }
                const test = await response.json();
                console.log(test)
                const passTime = test.passageTime.split(':');
                console.log(passTime);

                if(passTime != null ){
                    const endDateTime = new Date(startDateTime)
                    endDateTime.setHours(endDateTime.getHours() + parseInt(passTime[0]));
                    endDateTime.setMinutes(endDateTime.getMinutes() + parseInt(passTime[1]));
                    endDateTime.setSeconds(endDateTime.getSeconds() + parseInt(passTime[2]));
                    console.log(startDateTime)
                    console.log(endDateTime)
                    setTimer(<TestTimer startTime={startDateTime} endTime={endDateTime} functionOnEnd={TestEnd} timeFromStart={setAttemptDuration}/>)
                }

/*
                const response2 = await fetch(process.env.REACT_APP_SERVER_URL+'test/get-tasks-test', {
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
                setQuestions(questionsJson)*/
                const questionsJson = JSON.parse(sessionStorage.getItem("tasksForTest"))||[]
                setQuestions(questionsJson)
                console.log(questionsJson)
                setTopText("Контрольный тест");
            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }

        fetchTest();
    }, [topText]);

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
                <Button hidden={active+1!=questions.length?"hidden":""}  className="end-button" onClick={() => TestEnd(attemptDuration)}>Завершить тест</Button>

            </div>
            {/*<Footer />*/}
        </div>
    );
};

export default TestPage;
