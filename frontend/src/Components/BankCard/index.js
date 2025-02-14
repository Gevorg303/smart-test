import React, {useState,useEffect} from 'react';
import { Form, Button, Stack } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './style.css';
import DisplayTestCard from "../DisplayTestCard";
import DisplayTaskCard from "../DisplayTaskCard";
import DisplaySubjectCard from "../DisplaySubjectCard";
import DisplayThemeCard from "../DisplayThemeCard";

const BankCard = ({id,objectItem,type, setEditItem}) => {
    // objectItem - объект какого-то типа котоный отображается в карточке
    // type - тип объекта
    //setEditItem - функция меняющая текущий изменяемый объект ( передается из компонента question bank page)

   // const [questions, setQuestions] = useState([]);
    const [item, setItem] = useState(); // компонент отображения контента для карточек


    const handleDelete = async (event) => {
       // event.preventDefault();
        try {
            console.log("удалить задание: "+id);
            if(type === "test"){
                const response = await fetch('http://localhost:8080/test/delete', { // удалить тест
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
            }
            if(type === "task") {
                const response = await fetch('http://localhost:8080/task/delete', {  // удалить задание
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

            }
            if(type === "subject") {
                const response = await fetch('http://localhost:8080/subject/delete', { // удалить предмет
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify({id:id}
                    )
                });
                if (!response.ok) {
                    throw new Error("Ошибка удаления предмета");
                }

            }

        } catch (error) {
            console.error('Ошибка удаления данных:', error);
        }
        window.location.reload();
    }
    const handleEdit = async (event) => {
        // event.preventDefault();
        try {
            console.log("редактировать: "+id+" ("+type+")");
            setEditItem(objectItem)     // изменить изменяемый объект

        } catch (error) {
            console.error('Ошибка удаления данных:', error);
        }

    }

    useEffect(() => {
        async function fetchQuestions() {
            console.log(objectItem)
            //выюор компонента для отображения контента
            if(type==="test")
                setItem(<DisplayTestCard objectItem={objectItem}/>)
            if(type==="task")
                setItem( <DisplayTaskCard objectItem={objectItem}/>)
            if(type==="subject")
                setItem( <DisplaySubjectCard objectItem={objectItem}/>)
            if(type==="theme")
                setItem( <DisplayThemeCard objectItem={objectItem}/>)
           /* if(type=="test"){
                setItem(<DisplayTestCard objectItem={objectItem}/>);
            }
            if(type=="task"){
                setItem(<DisplayTaskCard objectItem={objectItem}/>);
            }*/
           /* if(isTest) {
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
            }*/
        }

        fetchQuestions();
    }, [objectItem]);
    return (
        <div className="bankcard">
            <Stack direction="horizontal" gap={2}>
                <Stack direction="vertical" gap={2}>
                    {item}
                   {/*!isTest ? <p>{obj.test.theme.subject.subjectName} > {obj.test.theme.themeName}</p>:<></>*/}



                    {/*type=="test" ? <p>Тест №{obj.id}</p>:<></>*/}
                   {/*type=="test" ?
                       <h2>{obj.theme.subject.subjectName} > {obj.theme.themeName}: {obj.typeTest.nameOfTestType}</h2>
                       :
                       <h2>Задача №{obj.id}</h2>*/}
                   {/*type=="test" ?
                       <p>{obj.description}</p> :
                       <p>{obj.taskText}</p>*/}



                   {/*isTest?questions.map((item, index)=><BankCard key={index} id={index} obj={item} isTest={false} />):<></>*/}
                </Stack>

                <Stack direction="vertical" gap={2}>
                    <Button className={"bankbutton"} variant="danger" onClick={() => (handleDelete())}><i className="bi bi-trash-fill"></i> {/*Удалить*/} </Button>
                    <Button className={"bankbutton"} variant="warning" onClick={() => (handleEdit())}> <i className="bi bi-pencil-fill"></i>{/*Редактировать*/}</Button>
                </Stack>
            </Stack>


        </div>
    );
};

export default BankCard;