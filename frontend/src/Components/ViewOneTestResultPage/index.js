import React, {useState,useEffect} from 'react';
import {Table,Button} from 'react-bootstrap';
import Question from "../Question";
import { useNavigate } from "react-router-dom";

const ViewTestResultsPage = (props) => {

    const [questions, setQuestions] = useState([]);
    const validList = JSON.parse(`${sessionStorage.getItem("testResult")}`)
    const [answers, setAnswers] = useState(validList.map((item,index)=> item.response));
    let ra = 0
    for (let number = 0; number < validList.length; number++) {
        //         a.push(validList[number].response);
        validList[number].status?ra++:ra=ra;
    }
    const [rightAnswers, setRightAnswers] = useState(ra);
    const [text, setText] = useState("");
    const [score, setScore] = useState(0);
    const [countOfQuestions, setCountOfQuestions] = useState(0);
    console.log(answers)

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
                //  console.log(test)
                setText(test.theme.themeName + ": " + test.typeTest.nameOfTestType)
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
                //   console.log(questionsJson)
                //     let validList = JSON.parse(`${sessionStorage.getItem("testResult")}`)
                //     let a =[];

                //  console.log(a);
                //  console.log("rightAnswers: "+ra);
              /*  const array = [];
                let count = 0
                questionsJson.forEach(question => {
                    array.push(

                        <Question view key={count} id={question.id} qStatus={validList[count].status} name={question.taskName} description={question.taskText} answers={answers} setAnswers={setAnswers} />
                    );

                    count++;
                });
                setQuestions(array);*/
                setQuestions(questionsJson)
                setCountOfQuestions(questionsJson.length)
                setScore((rightAnswers/ questionsJson.length)*100)
               // setCountOfQuestions(array.length)
               // setScore((rightAnswers/ array.length)*100)
            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }

        fetchTest();

    }, []);


    // console.log(answers)
    let navigate = useNavigate();
    function ViewResultsEnd()
    {
        //
        sessionStorage.clear()
        navigate("/theme");
    }
    return (
        <div>
            <h1>{text}</h1>
            <div>
                <h2>Ваш результат:</h2>
                <Table>
                    <tbody>
                    <tr>
                        <td>Всего вопросов:</td>
                        <td>{countOfQuestions}</td>
                    </tr>
                    <tr>
                        <td>Оценка:</td>
                        <td> {score} из 100</td>
                    </tr>
                    <tr>
                        <td>Оценка:</td>
                        <td> { score >= 60? "Зачтено" : "Не зачтено"} </td>
                    </tr>
                    </tbody>
                </Table>
                {/*questions*/}
                {questions.map((item,index)=> <Question key={index} qStatus={validList[index].status}  view id={index} name={questions[index]?.taskName || ""} description={questions[index]?.taskText || ""} answers={answers} setAnswers={setAnswers} />)}
                <Button onClick={()=>ViewResultsEnd()}>Закончить обзор</Button>
            </div>
        </div>
    );
};

export default ViewTestResultsPage;