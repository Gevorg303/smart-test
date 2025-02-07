import React, { useState, useEffect } from 'react';
import { Form, Button,Toast,ToastContainer } from 'react-bootstrap';
import ThemeAndIndicatorSelector from "../ThemeAndIndicatorSelector";
import TaskForTestSelector from "../TaskForTestSelector";

const CreateTestPage = () => {
    const [subjects, setSubjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [targetSubject, setTargetSubject] = useState(0);
    const [types, setTypes] = useState([]);
    const [show, setShow] = useState(false);
    const [toastText, setToastText] = useState("");

    const [currentType, setCurrentType] = useState();
    const [currentPassword, setCurrentPassword] = useState("");
    const [currentDescription, setCurrentDescription] = useState("");
    const [passingTime, setPassingTime] = useState();
    const [timeStart, setTimeStart] = useState();
    const [timeEnd, setTimeEnd] = useState();
    const [currentTasks , setCurrentTasks] = useState([]);
    const [countOfTry, setCountOfTry] = useState(1);
    const [currentTheme, setCurrentTheme] = useState(-1);
    const [currentPassingScore, setCurrentPassingScore] = useState(60); // прохоной балл

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const theme = parseInt(currentTheme , 10 );
            const taskList =[];
            for (var i=0; i < currentTasks.length; i++) {
                if(currentTasks[i]!=undefined)
                {
                    taskList.push({id:i})
                }
            }

          /*  console.log(
                {
                    test: {
                        closingDateAndTime : timeEnd,
                        description : currentDescription,
                        id : null,
                        numberOfAttemptsToPass : countOfTry,
                        openingDateAndTime : timeStart,
                        passageTime : passingTime+":00",
                        testPassword : currentPassword,
                        theme:{
                            id: theme
                        },
                        typeTest:{
                            id: currentType
                        }
                    },

                    taskList


                }

            );*/
            const response = await fetch('http://localhost:8080/test/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify(
                    {
                        test: {
                            closingDateAndTime : timeEnd,
                            description : currentDescription,
                            id : null,
                            numberOfAttemptsToPass : countOfTry,
                            openingDateAndTime : timeStart,
                            passageTime : passingTime+":00",
                            testPassword : currentPassword,
                           // passingScore: currentPassingScore,
                            theme:{
                                id: theme
                            },
                            typeTest:{
                                id: currentType
                            }
                        },
                        taskList
                    }
                )
            });
            if (!response.ok) {
                setToastText("Ошибка создания теста");
                setCurrentTasks([]);
                throw new Error();
            }
            setToastText("Тест успешно создан.");
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
                const response1 = await fetch('http://localhost:8080/users/current', {
                    credentials: "include",
                });
                if (!response1.ok) {
                    throw new Error('Ошибка сети');
                }
                const user = await response1.json();

                const response2 = await fetch(`http://localhost:8080/subject/${user.login}`);
                if (!response2.ok) {
                    throw new Error('Ошибка получения предметов');
                }

                const subjectsJson = await response2.json();
                console.log(subjectsJson)
                setSubjects(subjectsJson)

                const response3 = await fetch('http://localhost:8080/TypeTest/all');
                if (!response3.ok) {
                    throw new Error('Ошибка получения типов тестов');
                }

                const typeJson = await response3.json();
                console.log(typeJson)
                setTypes(typeJson)
                setCurrentType(typeJson[0].id);

                const intTheme=  parseInt(currentTheme , 10 );

                const response4 = await fetch('http://localhost:8080/test/get-available-tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify({
                             id: intTheme,
                        }
                    )
                });
                if (!response4.ok) {
                    throw new Error('Ошибка получения доступных заданий');
                }

                const taskJson = await response4.json();
                console.log(taskJson)
                setTasks(taskJson)


            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }
        fetchSubjects();
    }, [currentTheme]);
    return (
        <div>
            <h1>Создание теста</h1>
            <h3>Выберите предмет и тему теста</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Select
                        onChange={(e) => {
                            setTargetSubject(e.target.value);
                        }}>
                        <option value={-1}>Выберите предмет</option>
                        {subjects.map((item, index) => <option key={item.id}
                                                               value={item.id}> {item.subjectName + " " + item.teacherClass.studentClass.numberOfInstitution + item.teacherClass.studentClass.letterDesignation}  </option>)}

                    </Form.Select>
                </Form.Group>
                <ThemeAndIndicatorSelector needIndicators={false} targetSubject={targetSubject} setCurrentTheme={setCurrentTheme}/>
                <Form.Group className="mb-3">
                    <Form.Select onChange={(e) => {
                        setCurrentType(e.target.value);
                        /*setCurrentAnswers([]);*/
                    }}>

                        {types.map((item, index) => <option key={item.id} value={item.id}> {item.nameOfTestType}  </option>)}

                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Количество попыток</Form.Label>
                    <Form.Control value={countOfTry} onChange={(e) => {
                        const re = /^[0-9\b]+$/;
                        if(e.target.value === '' || e.target.value === '0') {
                            setCountOfTry(1);
                        }
                        else if (re.test(e.target.value)) {
                                setCountOfTry(parseInt(e.target.value));
                                console.log(parseInt(e.target.value))
                        }

                    }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Проходной балл %</Form.Label>
                    <Form.Control value={currentPassingScore} onChange={(e) => {
                        const re = /^[0-9\b]+$/;
                        if(e.target.value === '' || e.target.value === '0') {
                            setCurrentPassingScore(1);
                        }
                        else if (re.test(e.target.value)) {
                            if(parseInt(e.target.value) > 100){
                                setCurrentPassingScore(100);
                            }
                            else
                            {
                                setCurrentPassingScore(parseInt(e.target.value));
                                console.log(parseInt(e.target.value))
                            }
                        }

                    }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Время прохождения теста</Form.Label>
                    <Form.Control  type="time"  onChange={(e) => {
                        setPassingTime(e.target.value);
                    }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Дата начала</Form.Label>
                    <Form.Control type="datetime-local" onChange={(e) => {
                        setTimeStart(e.target.value);
                    }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Дата окончания</Form.Label>
                    <Form.Control type="datetime-local" onChange={(e) => {
                        setTimeEnd(e.target.value);
                    }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Описание</Form.Label>
                    <Form.Control  as="textarea" rows={3} onChange={(e) => {
                        setCurrentDescription(e.target.value);
                    }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Пароль</Form.Label>
                    <Form.Control onChange={(e) => {
                        setCurrentPassword(e.target.value);
                    }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Задания в тесте:</Form.Label>
                    {tasks.map((item, index) =>   <TaskForTestSelector id={item.id} task={{id:item.id,taskText:item.taskText} } answers={currentTasks} setAnswers={setCurrentTasks} /> )}

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

export default CreateTestPage;