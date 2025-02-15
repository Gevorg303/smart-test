import React, { useState, useEffect } from 'react';
import { Form, Button,Toast,ToastContainer } from 'react-bootstrap';
import ThemeAndIndicatorSelector from "../ThemeAndIndicatorSelector";

const CreateThemePage = ({editItem}) => {
    const [subjects, setSubjects] = useState([]); // предметы
    const [targetSubject, setTargetSubject] = useState(0); // id выбранного предмета
    const [show, setShow] = useState(false); // отображение тоста
    const [toastText, setToastText] = useState(""); // текст тоста

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
                        theme: {
                            name : currentName,
                            id : null,
                        }
                    }
                )
            });
            if (!response.ok) {
                setToastText("Ошибка создания темы");
                throw new Error();
            }
            setToastText("Тема успешно создана.");
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


            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }
        fetchSubjects();
    }, [editItem]);
    return (
        <div>
            <h1>Создание темы</h1>
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
                    setShow(true); /*console.log(currentAnswers)*/
                }}>
                    Создать
                </Button>
            </Form>
            <ToastContainer
                className="p-3"
                position={'middle-center'}
                style={{zIndex: 1}}
            >
                <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
                    <Toast.Header closeButton={false}>
                        <img
                            src="holder.js/20x20?text=%20"
                            className="rounded me-2"
                            alt=""
                        />
                        <strong className="me-auto">Уведомление:</strong>
                    </Toast.Header>
                    <Toast.Body>{toastText}</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
};

export default CreateThemePage;