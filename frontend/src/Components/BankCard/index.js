import React, {useState,useEffect} from 'react';
import { Form, Button } from 'react-bootstrap';

const BankCard = ({id,obj,isTest}) => {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        async function fetchQuestions() {
            if(isTest) {
                try {


                    const response = await fetch('http://localhost:8080/test/get-tasks-test', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify(obj)
                    });
                    if (!response.ok) {
                        throw new Error('Ошибка получения теста');
                    }
                    const questions = await response.json();
                    console.log( questions)
                    setQuestions(questions)


                } catch (error) {
                    console.error('Ошибка получения данных:', error);
                }
            }
        }

        fetchQuestions();
    }, []);
    return (
        <div className="card">
            {!isTest ? <p>{obj.test.theme.subject.subjectName} > {obj.test.theme.themeName}</p>:<></>}
            {isTest ?
                <h2>{obj.theme.subject.subjectName} > {obj.theme.themeName}: {obj.typeTest.nameOfTestType}</h2>:
                <h2>{obj.taskName}</h2>}
            {isTest ?
                <p>{obj.description}</p> :
                <p>{obj.taskText}</p>}
            {isTest?questions.map((item, index)=><BankCard id={index} obj={item} isTest={false} />):<></>}
        </div>
    );
};

export default BankCard;