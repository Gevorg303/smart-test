import { React,useEffect, useState } from 'react';
import Question from "../Question";
import { useNavigate } from "react-router-dom";
import {Pagination,Button} from 'react-bootstrap';

const TestPage = () => {

    let navigate = useNavigate();
    const [active, setActive] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [questions, setQuestions] = useState([]/*.map((item,index)=>{<Question />})*/);
    // const [paginationItems, setPaginationItems] = useState([]);
    // let count = 4; // количество вопросов
    //  let questions = []; //заполняем массив с вопросами из теста
    /*  for (let number = 0; number < count; number++) {
          questions.push(
              <Question key={number} id={number+1} description={number+1+" description"} answers={answers} setAnswers={setAnswers} />
          );
      }*/
    let paginationItems =[] //заполняем массив с кнопками для пагинации


    function TestEnd()
    {

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
                const response = await fetch('http://localhost:8080/test/id:'+testid);
                if (!response.ok) {
                    throw new Error('Ошибка получения теста');
                }
                const test = await response.json();
                console.log(test)

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


            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }

        fetchTest();
    }, []);
    console.log(answers)
    return (
        <div>
            <h1>Контрольный тест</h1>
            {/*{questions[active]}*/}
            <Question id={active} name={questions[active]?.taskName || ""} description={questions[active]?.taskText || ""} answers={answers} setAnswers={setAnswers} />
            <Pagination>
                <Pagination.Prev hidden={active === 0} onClick={() => { if(active != 0)setActive(active - 1 )}}/>
                {/*paginationItems*/}
                <Pagination.Item active>
                    {active+1 + " / " + questions.length}
                </Pagination.Item>
                <Pagination.Next hidden={active >= questions.length-1} onClick={() => { if(active < questions.length-1)setActive(active + 1 )}}/>
            </Pagination>
            <Button onClick={() =>TestEnd()}>Завершить тест</Button>
        </div>
    );
};

export default TestPage
