import React, { useState, useEffect } from 'react';
import { Form, Button,Toast,ToastContainer } from 'react-bootstrap';

const CreateSubjectPage = ({editItem, onCreate}) => {

    //const [show, setShow] = useState(false); // отображение тоста
    // [toastText, setToastText] = useState(""); // текст тоста

    const [currentName, setCurrentName] = useState(""); // введеное название
    const [currentDescription, setCurrentDescription] = useState(""); // введенное описание
    const [currentUser, setCurrentUser] = useState(); // user

    // Валидация названия предмета
    const isValidSubjectName = (name) => {
        return name.length <= 100;
    };

    // Валидация описания предмета
    const isValidSubjectDescription = (description) => {
        return description.length <= 500;
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        const errors = [];

        // Проверка поля Название предмета
        if (!isValidSubjectName(currentName)) {
            errors.push('Название предмета превышает 100 символов.');
        }

        // Проверка поля Описание предмета
        if (!isValidSubjectDescription(currentDescription)) {
            errors.push('Описание предмета превышает 500 символов.');
        }

        if (errors.length > 0) {
            // Вывести сообщение об ошибке
            console.error('Ошибки валидации:', errors.join(', '));
            return;
        }

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
            let toastText;

            if(editItem==null){
                const response = await fetch('http://localhost:8080/subject/add', { // добавить предмет
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify(
                        {
                            subject: {
                                subjectName : currentName,
                                description : currentDescription,
                                id : null,
                            },
                            user: {
                                id: currentUser.id
                            }
                        }
                    )
                });
                if (!response.ok) {
                    toastText = "Ошибка создания предмета";
                    throw new Error();
                }
                toastText = "Предмет успешно создан.";
            }
            else {
                const response = await fetch('http://localhost:8080/subject/update-subject', { // добавить предмет
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify(
                        {
                                subjectName : currentName,
                                description : currentDescription,
                                id : editItem.id,
                        }
                    )
                });
                if (!response.ok) {
                    toastText = "Ошибка редактирования предмета";
                    throw new Error();
                }
                toastText = "Предмет успешно редактирован.";
            }


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
                setCurrentUser(user);

            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }
        if(editItem!=null){ //выполняется если предается предмет который нужно изменить

            setCurrentName(editItem.subjectName);
            setCurrentDescription(editItem.description);

        }
        else {

            setCurrentName("");
            setCurrentDescription("");
        }
        fetchSubjects();
    }, [editItem]);
    return (
        <div>
            <h1>{editItem ? "Редактирование предмета" : "Создание предмета"}</h1>
            <h3>Введите название и описание предмета</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Название предмета</Form.Label>
                    <Form.Control value={currentName} onChange={(e) => {
                        setCurrentName(e.target.value);
                    }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Описание предмета</Form.Label>
                    <Form.Control value={currentDescription} onChange={(e) => {
                        setCurrentDescription(e.target.value);
                    }}/>
                </Form.Group>
                <Button variant="primary" type="submit" onClick={() => {
                    //setShow(true); /*console.log(currentAnswers)*/
                }}>
                    {editItem==null?"Создать":"Редактировать"}
                </Button>
            </Form>

        </div>
    );
};
export default CreateSubjectPage;