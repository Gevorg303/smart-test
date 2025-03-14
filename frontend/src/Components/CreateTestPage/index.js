import React, { useState, useEffect } from 'react';
import { Form, Button,Toast,ToastContainer } from 'react-bootstrap';
import ThemeAndIndicatorSelector from "../ThemeAndIndicatorSelector";
import TaskForTestSelector from "../TaskForTestSelector";

const CreateTestPage = ({editItem, onCreate}) => {
    //editItem - изменяемый объект который должен отображаться
    const [subjects, setSubjects] = useState([]); // предметы
    const [tasks, setTasks] = useState([]); // задания
    const [targetSubject, setTargetSubject] = useState(0); // id выбранного предмета
    const [types, setTypes] = useState([]); // типы тестов
    //const [show, setShow] = useState(false); // отображение тоста
    //const [toastText, setToastText] = useState(""); // текст тоста

    const [currentType, setCurrentType] = useState(); // введеный тип теста
    const [currentPassword, setCurrentPassword] = useState(""); // введеный пароль
    const [currentDescription, setCurrentDescription] = useState(""); // введеное описание
    const [passingTime, setPassingTime] = useState("00:00:00"); // введеное время прохождения
    const [timeStart, setTimeStart] = useState(Date.now()); // введеное время начала теста
    const [timeEnd, setTimeEnd] = useState(Date.now()); // введеное время конца теста
    const [currentTasks , setCurrentTasks] = useState([]); // выбранные задания для теста
    const [countOfTry, setCountOfTry] = useState(1); // количество попыток для теста
    const [countOfTaskByError, setCountOfTaskByError] = useState(0); // количество заданий за ошибку для теста
    const [currentTheme, setCurrentTheme] = useState(-1); // id выбранной темы
    const [currentPassingScore, setCurrentPassingScore] = useState(60); // проходной балл

    // Валидация описания
    const isValidDescription = (description) => {
        return description.length >= 10 && description.length <= 500;
    };

    // Валидация пароля
    const isValidPassword = (password) => {
        return password.length >= 4 && password.length <= 20;
    };

    // Валидация дат
    const isValidDateRange = (startDate, endDate) => {
        return new Date(startDate) <= new Date(endDate);
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        const errors = [];

        // Проверка поля Описание
        if (!isValidDescription(currentDescription)) {
            errors.push('Описание должно содержать от 10 до 500 символов.');
        }

        // Проверка поля Пароль
        if (!isValidPassword(currentPassword)) {
            errors.push('Пароль должен содержать от 4 до 20 символов.');
        }

        // Проверка полей Дата начала и Дата окончания
        if (!isValidDateRange(timeStart, timeEnd)) {
            errors.push('Дата начала не может быть позже даты окончания.');
        }

        if (errors.length > 0) {
            // Вывести сообщение об ошибке
            console.error('Ошибки валидации:', errors.join(', '));
            return;
        }

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
                        passageTime : passingTime,
                        testPassword : currentPassword,
                        numberOfTasksPerError: countOfTaskByError,
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
            const response = await fetch('http://localhost:8080/test/add', { // добавить тест
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
                            passageTime : passingTime,
                            testPassword : currentPassword,
                            numberOfTasksPerError: countOfTaskByError,
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
            let toastText;
            if (!response.ok) {
                toastText = "Ошибка создания теста";
                setCurrentTasks([]);
                throw new Error();
            }
            toastText = "Тест успешно создан.";
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

                const response3 = await fetch('http://localhost:8080/type-test/all');
                if (!response3.ok) {
                    throw new Error('Ошибка получения типов тестов');
                }

                const typeJson = await response3.json();
                console.log(typeJson)
                setTypes(typeJson)
                //setCurrentType(typeJson[0].id);

                const intTheme=  parseInt(currentTheme , 10 );

                let aveliabletaskrfortest = [];
                if(currentTheme>0){
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
                    aveliabletaskrfortest = taskJson;
                }
                else
                {
                    setTasks([])
                }

                if (editItem != null) {
                    const response5 = await fetch('http://localhost:8080/test/get-tasks-test', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify({
                                id: editItem.id,
                            }
                        )
                    });
                    if (!response5.ok) {
                        throw new Error('Ошибка получения заданий из теста');
                    }

                    const tasksFromTestJson = await response5.json();
                    console.log(tasksFromTestJson)
                    console.log(aveliabletaskrfortest.concat(tasksFromTestJson))
                    setTasks(aveliabletaskrfortest.concat(tasksFromTestJson))

                    const array = [...currentTasks];
                    tasksFromTestJson.map((item, index)=>{array[item.id] = {id: item.id};})
                    setCurrentTasks(array);
                }

            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }
        console.log("edit item: "+editItem)
        if(editItem!=null){ //выполняется если предается предмет который нужно изменить

            setTargetSubject(editItem.theme.subject.id)
            setCurrentTheme(editItem.theme.id);
            setCurrentType(editItem.typeTest.id);
            setCurrentPassword(editItem.testPassword?editItem.testPassword:"")
            setCurrentDescription(editItem.description?editItem.description:"")
            let passTime = editItem.passageTime?editItem.passageTime:"";
            setPassingTime(passTime);
            setCountOfTry(editItem.numberOfAttemptsToPass);
            setTimeEnd(editItem.closingDateAndTime?editItem.closingDateAndTime:"");
            setTimeStart(editItem.openingDateAndTime?editItem.openingDateAndTime:"");
            setCurrentTasks([]);
            setCurrentPassingScore(editItem.numberOfTasksPerError?editItem.numberOfTasksPerError:0);
           // setCountOfTaskByError();
        }
        else if(targetSubject<0){
            setTasks([])
            setTargetSubject(-1)
            setCurrentType();
            setCurrentPassword("");
            setCurrentDescription("");
            setPassingTime("00:00:00");
            setTimeStart(Date.now());
            setTimeEnd(Date.now());
            setCurrentTasks([]);
            setCountOfTry(1);
            setCountOfTaskByError(0);
            setCurrentTheme(-1);
            setCurrentPassingScore(60);
        }

        fetchSubjects();
    }, [currentTheme,editItem]);
    return (
        <div>
            <h1>{editItem?"Редактирование теста":"Создание теста"}</h1>
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
                <ThemeAndIndicatorSelector needIndicators={false} targetSubject={targetSubject} currentTheme={currentTheme} setCurrentTheme={setCurrentTheme}/>
                <Form.Group className="mb-3">
                    <Form.Select value={currentType} onChange={(e) => {
                        setCurrentType(e.target.value);
                        /*setCurrentAnswers([]);*/
                    }}>
                        <option value={-1}>Выберите тип теста</option>
                        {types.map((item, index) => <option key={item.id}
                                                            value={item.id}> {item.nameOfTestType}  </option>)}

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
                {
                    currentType == 2?
                        <Form.Group className="mb-3">
                            <Form.Label>Количество заданий за ошибку</Form.Label>
                            <Form.Control value={countOfTaskByError} onChange={(e) => {
                                const re = /^[0-9\b]+$/;
                                if(e.target.value === '' || e.target.value === '0') {
                                    setCountOfTaskByError(0);
                                }
                                else if (re.test(e.target.value)) {
                                    setCountOfTaskByError(parseInt(e.target.value));
                                    console.log(parseInt(e.target.value))
                                }

                            }}/>
                        </Form.Group>
                        :
                        <></>
                }
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
                    <Form.Control value={passingTime} type="time" step="1"  onChange={(e) => {
                        setPassingTime(e.target.value);
                    }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Дата начала</Form.Label>
                    <Form.Control value={timeStart} type="datetime-local" onChange={(e) => {
                        setTimeStart(e.target.value);
                    }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Дата окончания</Form.Label>
                    <Form.Control value={timeEnd} type="datetime-local" onChange={(e) => {
                        setTimeEnd(e.target.value);
                    }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Описание</Form.Label>
                    <Form.Control value={currentDescription} as="textarea" rows={3} onChange={(e) => {
                        setCurrentDescription(e.target.value);
                    }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Пароль</Form.Label>
                    <Form.Control value={currentPassword} onChange={(e) => {
                        setCurrentPassword(e.target.value);
                    }}/>
                </Form.Group>
                {
                    currentType !=2?
                    <Form.Group className="mb-3">
                        <Form.Label>Задания в тесте:</Form.Label>
                        {tasks.map((item, index) =>   <TaskForTestSelector key={item.id} id={item.id} task={{id:item.id,taskText:item.taskText} } answers={currentTasks} setAnswers={setCurrentTasks} /> )}

                    </Form.Group>
                    :
                    <></>
                }


                <Button variant="primary" type="submit" onClick={() => {
                    //setShow(true); /*console.log(currentAnswers)*/
                }}>
                    Создать
                </Button>
            </Form>
        </div>
    );
};

export default CreateTestPage;