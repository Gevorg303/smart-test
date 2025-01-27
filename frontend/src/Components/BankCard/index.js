import React, {useState,useEffect} from 'react';
import { Form, Button } from 'react-bootstrap';

const BankCard = ({id,obj,isTest}) => {
    const [questions, setQuestions] = useState([]);


    const handleSubmit = async (event) => {
       // event.preventDefault();
        try {
            console.log("удалить задание: "+id);
            const response = await fetch('http://localhost:8080/task/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({id:id}
                )
            });
            if (!response.ok) {
                throw new Error("Ошибка удаления задания");
            }
        } catch (error) {
            console.error('Ошибка удаления данных:', error);
        }
        window.location.reload();
    }

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
                        throw new Error('Ошибка получения вопросов из теста');
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
            <Button variant="success"> Редактировать </Button>
            <Button variant="danger" onClick={()=>( handleSubmit() )}> Удалить </Button>
            {/*!isTest ? <p>{obj.test.theme.subject.subjectName} > {obj.test.theme.themeName}</p>:<></>*/}
            {isTest ? <p>Тест №{obj.id}</p>:<></>}
            {isTest ?
                <h2>{obj.theme.subject.subjectName} > {obj.theme.themeName}: {obj.typeTest.nameOfTestType}</h2>
                :
                <h2>Задача №{obj.id}</h2>}
            {isTest ?
                <p>{obj.description}</p> :
                <p>{obj.taskText}</p>}
            {/*isTest?questions.map((item, index)=><BankCard key={index} id={index} obj={item} isTest={false} />):<></>*/}
        </div>
    );
};

export default BankCard;