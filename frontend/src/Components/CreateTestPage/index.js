import React, { useState, useEffect } from 'react';
import { Form, Button, Toast, ToastContainer } from 'react-bootstrap';
import ThemeAndIndicatorSelector from "../ThemeAndIndicatorSelector";
import TaskForTestSelector from "../TaskForTestSelector";
import './styles.css';

const CreateTestPage = ({ editItem, onCreate, onError}) => {
    const [subjects, setSubjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [targetSubject, setTargetSubject] = useState(0);
    const [types, setTypes] = useState([]);

    const [currentType, setCurrentType] = useState();
    const [currentPassword, setCurrentPassword] = useState("");
    const [currentDescription, setCurrentDescription] = useState("");
    const [passingTime, setPassingTime] = useState("00:00:00");
    const [timeStart, setTimeStart] = useState(Date.now());
    const [timeEnd, setTimeEnd] = useState(Date.now());
    const [currentTasks, setCurrentTasks] = useState([]);
    const [countOfTry, setCountOfTry] = useState(1);
    const [countOfTaskByError, setCountOfTaskByError] = useState(0);
    const [currentTheme, setCurrentTheme] = useState(-1);
    const [currentPassingScore, setCurrentPassingScore] = useState(60);

    const [notEditedTasks, setNotEditedTasks] = useState([]);
    // Валидация описания
    const isValidDescription = (description) => {
        return description === "" || (description.length >= 10 && description.length <= 500);
    };

    // Валидация пароля
    const isValidPassword = (password) => {
        return password === "" || (password.length >= 4 && password.length <= 20);
    };

    // Валидация дат
    const isValidDateRange = (startDate, endDate) => {
        return new Date(startDate) <= new Date(endDate);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const errors = [];

        console.log("passingTime:", passingTime);
        console.log("timeStart:", timeStart);
        console.log("timeEnd:", timeEnd);

        // Проверка поля Описание
        if (currentDescription && !isValidDescription(currentDescription)) {
            errors.push('Описание должно содержать от 10 до 500 символов.');
        }

        // Проверка поля Пароль
        if (currentPassword && !isValidPassword(currentPassword)) {
            errors.push('Пароль должен содержать от 4 до 20 символов.');
        }

        // Проверка полей Дата начала и Дата окончания
        if (!isValidDateRange(timeStart, timeEnd)) {
            errors.push('Дата начала не может быть позже даты окончания.');
        }

        // Проверка обязательных полей
        if (targetSubject <= 0) {
            errors.push('Предмет должен быть выбран.');
        }

        if (currentTheme <= 0) {
            errors.push('Тема должна быть выбрана.');
        }

        if (!currentType) {
            errors.push('Тип теста должен быть выбран.');
        }

        if (!passingTime || passingTime === "00:00:00") {
            errors.push('Время прохождения теста должно быть указано.');
        }

        if (timeStart > 1000000000000) {
            errors.push('Дата начала теста должна быть указана.');
        }

        if (timeEnd > 1000000000000) {
            errors.push('Дата окончания теста должна быть указана.');
        }


        if (errors.length > 0) {
            onError(errors);
            console.error('Ошибки валидации:', errors.join(', '));
            return;
        }

        try {


            const theme = parseInt(currentTheme, 10);

            const responseTest = await fetch(process.env.REACT_APP_SERVER_URL+'test/get-test-id-theme', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({id: theme})
            });
            if (!responseTest.ok) {
                throw new Error('Ошибка получения тестов по теме');
            }

            const findSameType = await responseTest.json();

            const findTest = findSameType.find((el) => el.typeTest.id == currentType)
            const findEnterTest = findSameType.find((el) => el.typeTest.id == 1)

            const taskList = [];
            for (var i = 0; i < currentTasks.length; i++) {
               // if (currentTasks[i] != undefined) {
                    taskList.push(currentTasks[i])
              //  }
            }
            console.log(currentTasks)
            console.log(notEditedTasks)
            const editedTaskList = [];
            currentTasks.map((item,index)=>{

                    editedTaskList.push({
                        task: item,
                        isDeleted: false
                    })
            })
            notEditedTasks.map((item,index)=>{
                const find = currentTasks.find(el => el.id===item.id);
                if(find === undefined) {
                    editedTaskList.push({
                        task: item,
                        isDeleted: true
                    })
                }
            })
            const array = []
            editedTaskList.map((item,index) => {
                array.push(item.task)
            })
            setNotEditedTasks(array);
            let toastText;
            console.log({
                testDto: {
                    closingDateAndTime: timeEnd,
                    description: currentDescription,
                    id: editItem === null ? null : editItem.id,
                    numberOfAttemptsToPass: countOfTry,
                    openingDateAndTime: timeStart,
                    passageTime: passingTime,
                    testPassword: currentPassword,
                    numberOfTasksPerError: countOfTaskByError,
                    passThreshold: currentPassingScore,
                    theme: {
                        id: theme
                    },
                    typeTest: {
                        id: currentType
                    }
                },
                taskDtoList: editItem==null?taskList:editedTaskList
            });
            if(editItem==null) {

                if(findTest !== undefined){
                    onError(["Ошибка! Тест такого типа уже существует!"]);
                    throw new Error('Тест такого типа уже существует');
                }
                if(findEnterTest === undefined){
                    onError(["Ошибка! Входной тест в теме отсутсвует! Необходимо создать входной тест!"]);
                    throw new Error("Ошибка! Входной тест в теме отсутсвует! Необходимо создать входной тест!");
                }


                const response = await fetch(process.env.REACT_APP_SERVER_URL+'test/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify(
                        {
                            test: {
                                closingDateAndTime: timeEnd,
                                description: currentDescription,
                                id: null,
                                numberOfAttemptsToPass: countOfTry,
                                openingDateAndTime: timeStart,
                                passageTime: passingTime,
                                testPassword: currentPassword,
                                numberOfTasksPerError: countOfTaskByError,
                                passThreshold: currentPassingScore,
                                theme: {
                                    id: theme
                                },
                                typeTest: {
                                    id: currentType
                                }
                            },
                            taskList
                        }
                    )
                });

                if (!response.ok) {
                    toastText = "Ошибка создания теста";
                    setCurrentTasks([]);
                    throw new Error();
                }
                toastText = "Тест успешно создан.";
            } else {
                const response = await fetch(process.env.REACT_APP_SERVER_URL+'test/update-test', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify(
                        {
                            testDto: {
                                closingDateAndTime: timeEnd,
                                description: currentDescription,
                                id: editItem.id,
                                numberOfAttemptsToPass: countOfTry,
                                openingDateAndTime: timeStart,
                                passageTime: passingTime,
                                testPassword: currentPassword,
                                numberOfTasksPerError: countOfTaskByError,
                                passThreshold: currentPassingScore,
                                theme: {
                                    id: theme
                                },
                                typeTest: {
                                    id: currentType
                                }
                            }
                            ,
                            editingTaskRequests: editedTaskList
                        }
                    )
                });

                if (!response.ok) {
                    toastText = "Ошибка редактирования теста";
                    setCurrentTasks([]);
                    throw new Error();
                }
                toastText = "Тест успешно отредактирован.";
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
                setSubjects(subjectsJson)

                const response3 = await fetch(process.env.REACT_APP_SERVER_URL+'type-test/all');
                if (!response3.ok) {
                    throw new Error('Ошибка получения типов тестов');
                }

                const typeJson = await response3.json();
                setTypes(typeJson)
                

            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }

        if (editItem != null) {
            setTargetSubject(editItem.theme.subject.id)
            setCurrentTheme(editItem.theme.id);
            setCurrentType(editItem.typeTest.id);
            setCurrentPassword(editItem.testPassword ? editItem.testPassword : "")
            setCurrentDescription(editItem.description ? editItem.description : "")
            let passTime = editItem.passageTime ? editItem.passageTime : "";
            setPassingTime(passTime);
            setCountOfTry(editItem.numberOfAttemptsToPass);
            setTimeEnd(editItem.closingDateAndTime ? editItem.closingDateAndTime : "");
            setTimeStart(editItem.openingDateAndTime ? editItem.openingDateAndTime : "");
            setCurrentTasks([]);
            setCurrentPassingScore(editItem.passThreshold ? editItem.passThreshold : 0);
            setCountOfTaskByError(editItem.numberOfTasksPerError ? editItem.numberOfTasksPerError : 0);
        } else if (targetSubject < 0) {
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
    }, [/*currentTheme,*/ editItem]);
    useEffect(() => {
        async function fetchTasks() {
            try {
                const intTheme = parseInt(currentTheme, 10);
                let aveliabletaskrfortest = [];
                if (currentTheme > 0) {
                    const response4 = await fetch(process.env.REACT_APP_SERVER_URL+'test/get-available-tasks', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify({
                            id: intTheme,
                        })
                    });
                    if (!response4.ok) {
                        throw new Error('Ошибка получения доступных заданий');
                    }

                    const taskJson = await response4.json();
                    setTasks(taskJson)
                    aveliabletaskrfortest = taskJson;
                } else {
                    setTasks([])
                }

                if (editItem != null) {
                    const response5 = await fetch(process.env.REACT_APP_SERVER_URL+'test/get-tasks-test', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify({
                            id: editItem.id,
                        })
                    });
                    if (!response5.ok) {
                        throw new Error('Ошибка получения заданий из теста');
                    }

                    const tasksFromTestJson = await response5.json();
                    setTasks(aveliabletaskrfortest.concat(tasksFromTestJson))

                    const array = [...currentTasks];
                    tasksFromTestJson.map((item, index) => { array.push({ id: item.id }); })
                    setCurrentTasks(array);
                    setNotEditedTasks(array)
                }
            }  catch (error) {
                console.error('Ошибка получения тестов:', error);
            }
        }
        fetchTasks();
    }, [currentTheme]);
    return (
        <div>
            <h1>{editItem ? "Редактирование теста" : "Создание теста"}</h1>
            <h3>Выберите предмет и тему теста</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Select
                        onChange={(e) => {
                            setTargetSubject(e.target.value);
                        }} value={targetSubject}>
                        <option value={-1}>Выберите предмет</option>
                        {subjects.map((item, index) => <option key={item.id}
                                                               value={item.id}> {item.subjectName}  </option>)}
                    </Form.Select>
                </Form.Group>
                <ThemeAndIndicatorSelector needIndicators={false} targetSubject={targetSubject} currentTheme={currentTheme} setCurrentTheme={setCurrentTheme} />
                <Form.Group className="mb-3">
                    <Form.Select value={currentType} onChange={(e) => {
                        setCurrentType(e.target.value);
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
                        if (e.target.value === '' || e.target.value === '0') {
                            setCountOfTry(1);
                        }
                        else if (re.test(e.target.value)) {
                            setCountOfTry(parseInt(e.target.value));
                        }
                    }} />
                </Form.Group>
                {
                    currentType == 2 ?
                        <Form.Group className="mb-3">
                            <Form.Label>Количество заданий за ошибку</Form.Label>
                            <Form.Control value={countOfTaskByError} onChange={(e) => {
                                const re = /^[0-9\b]+$/;
                                if (e.target.value === '' || e.target.value === '0') {
                                    setCountOfTaskByError(0);
                                }
                                else if (re.test(e.target.value)) {
                                    setCountOfTaskByError(parseInt(e.target.value));
                                }
                            }} />
                        </Form.Group>
                        :
                        <></>
                }
                <Form.Group className="mb-3">
                    <Form.Label>Проходной балл %</Form.Label>
                    <Form.Control value={currentPassingScore} onChange={(e) => {
                        const re = /^[0-9\b]+$/;
                        if (e.target.value === '' || e.target.value === '0') {
                            setCurrentPassingScore(1);
                        }
                        else if (re.test(e.target.value)) {
                            if (parseInt(e.target.value) > 100) {
                                setCurrentPassingScore(100);
                            }
                            else {
                                setCurrentPassingScore(parseInt(e.target.value));
                            }
                        }
                    }} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Время прохождения теста</Form.Label>
                    <Form.Control value={passingTime} type="time" step="1" onChange={(e) => {
                        setPassingTime(e.target.value);
                    }} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Дата начала</Form.Label>
                    <Form.Control value={timeStart} type="datetime-local" onChange={(e) => {
                        setTimeStart(e.target.value);
                    }} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Дата окончания</Form.Label>
                    <Form.Control value={timeEnd} type="datetime-local" onChange={(e) => {
                        setTimeEnd(e.target.value);
                    }} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Описание</Form.Label>
                    <Form.Control value={currentDescription} as="textarea" rows={3} onChange={(e) => {
                        setCurrentDescription(e.target.value);
                    }} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Пароль</Form.Label>
                    <Form.Control value={currentPassword} onChange={(e) => {
                        setCurrentPassword(e.target.value);
                    }} />
                </Form.Group>
                {

                        <Form.Group className="mb-3">
                            <Form.Label>Задания в тесте:</Form.Label>
                            {tasks.map((item, index) => <TaskForTestSelector key={item.id} id={item.id} task={{ id: item.id, taskText: item.taskText }} answers={currentTasks} setAnswers={setCurrentTasks} />)}
                        </Form.Group>

                }
                <Button variant="primary" className="custom-button-create-window" type="submit" onClick={() => {
                    //setShow(true); /*console.log(currentAnswers)*/
                }}>
                    {editItem==null?"Создать":"Редактировать"}
                </Button>
            </Form>
        </div>
    );
};

export default CreateTestPage;
