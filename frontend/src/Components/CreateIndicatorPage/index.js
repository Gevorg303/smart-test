import React, { useState, useEffect } from 'react';
import { Form, Button,Toast,ToastContainer } from 'react-bootstrap';
import ThemeAndIndicatorSelector from "../ThemeAndIndicatorSelector";
import './styles.css';

const CreateIndicatorPage = ({editItem, onCreate, onError}) => {
    const [subjects, setSubjects] = useState([]); // предметы
    const [targetSubject, setTargetSubject] = useState(0); // id выбранного предмета
    //const [show, setShow] = useState(false); // отображение тоста
    //const [toastText, setToastText] = useState(""); // текст тоста

    const [currentName, setCurrentName] = useState(""); // введеное название
    const [currentTheme, setCurrentTheme] = useState(-1); // id выбранной темы

    // Валидация названия индикатора
    const isValidIndicatorName = (name) => {
        return name.length <= 100;
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        const errors = [];

        if (!currentName || currentName.trim() === "") {
            errors.push('Название индикатора не должно быть пустым.');
        }

        // Проверка поля Название индикатора
        if (!isValidIndicatorName(currentName)) {
            errors.push('Название индикатора превышает 100 символов.');
        }

        if (targetSubject <= 0) {
            errors.push('Предмет должен быть выбран.');
        }

        if (currentTheme <= 0) {
            errors.push('Тема должна быть выбрана.');
        }


        if (errors.length > 0) {
            // Вывести сообщение об ошибке
            onError(errors);
            console.error('Ошибки валидации:', errors.join(', '));
            return;
        }

        try {
            const theme = parseInt(currentTheme , 10 );


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
                const response = await fetch(process.env.REACT_APP_SERVER_URL+'indicator/add', { // добавить индикатор
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify(
                        {
                            nameOfTheIndicator : currentName,
                            id : null,
                            theme:{
                                id: theme
                            }
                        }
                    )
                });
                if (!response.ok) {
                    toastText = "Ошибка создания индикатора";
                    throw new Error();
                }
                toastText = "Индикатор успешно создан.";
            }
            else{
                const response = await fetch(process.env.REACT_APP_SERVER_URL+'indicator/update-indicator', { // добавить индикатор
                    method: 'PUt',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify(
                        {
                            nameOfTheIndicator : currentName,
                            id : editItem.id,
                            theme:{
                                id: theme
                            }
                        }
                    )
                });
                if (!response.ok) {
                    toastText = "Ошибка редактирования индикатора";
                    throw new Error();
                }
                toastText = "Индикатор успешно редактирован.";
            }

            onCreate(toastText);
        } catch (error) {
            console.error('Ошибка отправки данных:', error);
        }
    }
    useEffect(() => {
        async function fetchSubjects() {
            try {
                console.log("тема: "+currentTheme)
                document.cookie = "sub=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
                document.cookie = "test=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
                const response1 = await fetch(process.env.REACT_APP_SERVER_URL+'users/current', {
                    credentials: "include",
                });
                if (!response1.ok) {
                    throw new Error('Ошибка сети');
                }
                const user = await response1.json();

                const response2 = await fetch(process.env.REACT_APP_SERVER_URL+'subject/print-user-subject', {
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

            setTargetSubject(editItem.theme.subject.id);
            setCurrentName(editItem.nameOfTheIndicator);
            setCurrentTheme(editItem.theme.id);

        }
        else {
            if(currentTheme == null) {
                setTargetSubject(-1);
                setCurrentTheme(-1);
            }
            setCurrentName("");
        }

        fetchSubjects();
    }, [currentTheme,editItem]);
    return (
        <div>
            <h1>{editItem ? "Редактирование индикатора" : "Создание индикатора"}</h1>
            <h3>Выберите предмет и тему теста</h3>
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
                <ThemeAndIndicatorSelector needIndicators={false} targetSubject={targetSubject}
                                           currentTheme={currentTheme} setCurrentTheme={setCurrentTheme}/>


                <Form.Group className="mb-3">
                    <Form.Label>Название индикатора</Form.Label>
                    <Form.Control value={currentName} onChange={(e) => {
                        setCurrentName(e.target.value);
                    }}/>
                </Form.Group>

                <Button variant="primary" className="custom-button-create-window" type="submit" onClick={() => {
                    //setShow(true); /*console.log(currentAnswers)*/
                }}>
                    {editItem==null?"Создать":"Редактировать"}
                </Button>

            </Form>
        </div>
    );
};

export default CreateIndicatorPage;
