import React, { useState, useEffect } from 'react';
import { Form, Button,Toast,ToastContainer } from 'react-bootstrap';
import ThemeAndIndicatorSelector from "../ThemeAndIndicatorSelector";

const CreateThemePage = ({editItem, onCreate}) => {
    const [subjects, setSubjects] = useState([]); // предметы
    const [targetSubject, setTargetSubject] = useState(0); // id выбранного предмета
    //const [show, setShow] = useState(false); // отображение тоста
    //const [toastText, setToastText] = useState(""); // текст тоста

    const [currentName, setCurrentName] = useState(""); // введеное название


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {

            /*console.log(
                {
                    test: {
                        name : currentName,
                        id : null,
                        theme:{
                            id: theme
                        },
                    },

                }

            );*/
            const response = await fetch('http://localhost:8080/theme/add', { // добавить тему
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify(
                    {
                        themeName : currentName,
                            id : null,
                        subject: {
                            id: targetSubject
                        }
                    }
                )
            });
            let toastText;
            if (!response.ok) {
                toastText = "Ошибка создания темы";
                throw new Error();
            }
            toastText = "Тема успешно создана.";
            onCreate(toastText);
        } catch (error) {
            console.error('Ошибка отправки данных:', error);
        }
    }
    useEffect(() => {
        async function fetchSubjects() {
            try {
                document.cookie = "sub=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
                document.cookie = "test=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
                const response1 = await fetch('http://localhost:8080/users/current', {
                    credentials: "include",
                });
                if (!response1.ok) {
                    throw new Error('Ошибка сети');
                }
                const user = await response1.json();

                const response2 = await fetch('http://localhost:8080/subject/print-user-subject', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify(user)
                });
                if (!response2.ok) {
                    throw new Error('Ошибка получения предметов');
                }

                const subjectsJson = await response2.json();
                console.log(subjectsJson)
                setSubjects(subjectsJson)

            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }
        if(editItem!=null){ //выполняется если предается предмет который нужно изменить

            setTargetSubject(editItem.subject.id)
            setCurrentName(editItem.themeName);
        }
        else if(targetSubject<0){
            setTargetSubject(-1)
            setCurrentName();
        }
        fetchSubjects();
    }, [editItem]);
    return (
        <div>
            <h1>{editItem ? "Редактирование темы" : "Создание темы"}</h1>
            <h3>Выберите предмет и введите название темы</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Select
                        onChange={(e) => {
                            setTargetSubject(e.target.value);
                        }} value={targetSubject}>
                        <option value={-1}>Выберите предмет</option>
                        {subjects.map((item, index) => <option key={item.id}
                                                               value={item.id}> {item.subjectName/* + " " + item.teacherClass.studentClass.numberOfInstitution + item.teacherClass.studentClass.letterDesignation*/}  </option>)}

                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Название темы</Form.Label>
                    <Form.Control value={currentName} onChange={(e) => {
                        setCurrentName(e.target.value);
                    }}/>
                </Form.Group>
                <Button variant="primary" type="submit" onClick={() => {
                    //setShow(true); /*console.log(currentAnswers)*/
                }}>
                    Создать
                </Button>
            </Form>

        </div>
    );
};

export default CreateThemePage;