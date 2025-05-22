import React, { useState, useEffect } from 'react';
import { Form, Button,Toast,ToastContainer } from 'react-bootstrap';
import ThemeAndIndicatorSelector from "../ThemeAndIndicatorSelector";
import FormSelectAnswer from "../FormSelectAnswer";
import './styles.css';


const CreateQuestionPage = ({editItem, onCreate, onError}) => {
    const [subjects, setSubjects] = useState([]);
    const [types, setTypes] = useState([]);
    const [targetSubject, setTargetSubject] = useState(0);
    //const [show, setShow] = useState(false);
    //const [toastText, setToastText] = useState("");

    const [currentType, setCurrentType] = useState();
   // const [currentSubject, setCurrentSubject] = useState();
    const [currentTheme, setCurrentTheme] = useState();
    const [currentIndicators, setIndicators] = useState([]);
    const [currentText, setText] = useState();
    const [currentExplanation, setExplanation] = useState();
    const [currentAnswers,setCurrentAnswers] = useState([]);

    const [notEditedAnswers, setNotEditedAnswers] = useState([])
    const [notEditedIndicatros, setNotEditedIndicatros] = useState([])


    // Валидация задания и пояснения
    const isValidTaskOrExplanation = (text) => {
        return text.length <= 500;
    };

    // Валидация ответа
    const isValidAnswer = (text) => {
        return text.length <= 50;
    };



    const onClick = (id, answer) => {
        const array = [...currentAnswers];
        array[id] = answer;
        setCurrentAnswers(array);
    };
    const onClickDel = () => {
        const array = [...currentAnswers];
        array.pop();
        setCurrentAnswers(array);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();


        const errors = [];

        // Проверка поля Задание на пустоту
        if (!currentText || currentText.trim() === "") {
            errors.push('Текст задания не должен быть пустым.');
        }

        // Проверка поля Задание
        if (!isValidTaskOrExplanation(currentText)) {
            errors.push('Текст задания превышает 500 символов.');
        }

        // Проверка поля Пояснение
        if (!isValidTaskOrExplanation(currentExplanation)) {
            errors.push('Пояснение превышает 500 символов.');
        }

        // Проверка полей Ответ
        currentAnswers.forEach((answer, index) => {
            if (answer.response && !isValidAnswer(answer.response)) {
                errors.push(`Ответ ${index + 1} превышает 50 символов.`);
            }
        });

        if (targetSubject <= 0) {
            errors.push('Предмет должен быть выбран.');
        }

        if (currentTheme <= 0) {
            errors.push('Тема должна быть выбрана.');
        }

        if (!currentType) {
            errors.push('Тип задания должен быть выбран.');
        }


        // Проверка на наличие хотя бы одного выбранного индикатора
        if (!currentIndicators.some(indicator => indicator !== undefined && indicator)) {
            errors.push('Хотя бы один индикатор должен быть выбран.');
        }


        if (errors.length > 0) {
            // Вывести сообщение об ошибке
            onError(errors);
            console.error('Ошибки валидации:', errors.join(', '));
            return;
        }


        try {
            const type = parseInt(currentType , 10 );
            const indicators=[]; //=  currentIndicators.map((item, index) =>item!=undefined?{id:index}: null)
            for (var i=0; i < currentIndicators.length; i++) {
                if(currentIndicators[i]!=undefined && currentIndicators[i])
                {
                    indicators.push({id:i})
                }
            }

            const editedIndicators=[];
            currentIndicators.map((item,index) => {
                if(item !== undefined){
                    const isDelteted = notEditedIndicatros[index] !== undefined && currentIndicators[index] !== notEditedIndicatros[index]
                    editedIndicators.push({
                        indicator: {id: index, theme:{id:currentTheme}},
                        isDeleted: isDelteted
                    })
                }
            })
            console.log(currentIndicators)
            console.log(notEditedIndicatros)
            console.log(editedIndicators)
            console.log("---")

            const editedAnswers = [];
            currentAnswers.map((item,index) => {
                editedAnswers.push({
                    responseOptionDto:item,
                    isDeleted: false
                })
            })

            console.log(notEditedAnswers)
            console.log(editedAnswers)
            if(editItem !=null){
                editedAnswers.map((item,index) => {
                    const find = notEditedAnswers.find(el => el.id===item.responseOptionDto.id);
                    // console.log(find)
                    if(find  !== undefined){
                        item.isDeleted = false;
                    } else {
                        if(item.responseOptionDto.id !== undefined){
                            item.isDeleted = true;
                        } else {
                            item.isDeleted = false;
                        }
                    }
                })

            }
            notEditedAnswers.map((item,index) => {
                const find = editedAnswers.find(el => el.responseOptionDto.id !== undefined && el.responseOptionDto.id===item.id);
                // console.log(find)
                if(find  === undefined){
                    editedAnswers.push({
                        responseOptionDto:item,
                        isDeleted: true
                    })
                }
            })
            const array = []
            editedAnswers.map((item,index) => {
                array.push(item.responseOptionDto)
            })
            setNotEditedAnswers(array);
            console.log(
                {
                    task: {
                        id: null,
                        test: null,
                        typeTask: {id: type},
                        assessmentTask: 100,
                        taskText: currentText,
                        explanation: currentExplanation
                    },

                    responseOption: editItem==null?currentAnswers:editedAnswers
                    ,
                    indicator: editItem==null?indicators:editedIndicators
                }

            );


            let toastText;
            if(editItem==null) {
                const response = await fetch(process.env.REACT_APP_SERVER_URL+'task/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify({
                            task: {
                                id: null,
                                test: null,
                                typeTask: {id: type},
                                assessmentTask: 100,
                                taskText: currentText,
                                explanation: currentExplanation
                            },

                            responseOption: currentAnswers
                            ,
                            indicator: indicators
                        }
                    )
                });

                if (!response.ok) {
                    toastText = "Ошибка создния задания";
                    throw new Error();
                }
                toastText = "Задание создано";
            } else {
                const response = await fetch(process.env.REACT_APP_SERVER_URL+'task/update-task', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify({
                        task: {
                                id: editItem.id,
                                test: editItem.test,
                                typeTask: {id: type},
                                taskText: currentText,
                                explanation: currentExplanation
                            },

                        editingResponseOption: editedAnswers
                            ,
                        editingIndicatorRequestList: editedIndicators
                        }
                    )
                });

                if (!response.ok) {
                    toastText = "Ошибка создния задания";
                    throw new Error();
                }
                toastText = "Задание создано";
            }

            onCreate(toastText);
        } catch (error) {
            console.error('Ошибка отправки данных:', error);
        }
    }

    const renderAnswers = () => {
        console.log("Current type : "+currentType)
        let type = parseInt(currentType)
        switch (type) {
            case 1:
                return <>
                    <Form.Label>Ответы для сопоставления:</Form.Label>
                    <br></br>
                    {currentAnswers.map((item, index) =>
                        <FormSelectAnswer key={index} id={index} isMultiple={false} answers={currentAnswers} setAnswers={setCurrentAnswers}/>
                    )}
                    <Button onClick={()=>{
                        onClick(currentAnswers.length,{
                            question: "",
                            response: "",
                            validResponse: false
                        });
                        console.log(currentAnswers)
                    }}>Добавить вариант ответа</Button>
                    <Button onClick={()=>{
                        onClickDel();
                        console.log(currentAnswers)
                    }}>Убрать последний вариант ответа</Button>
                </>;
            case 2:
                return <>
                    <Form.Label>Ответы для выбора:</Form.Label>
                    <br></br>
                    {currentAnswers.map((item, index) =>
                        <FormSelectAnswer key={index} id={index} isMultiple={true} answers={currentAnswers}
                                          setAnswers={setCurrentAnswers}/>
                    )}
                    <Button onClick={() => {
                        onClick(currentAnswers.length, {
                            question: "",
                            response: "",
                            validResponse: false
                        });
                        console.log(currentAnswers)
                    }}>Добавить вариант ответа</Button>
                    <Button onClick={() => {
                        onClickDel();
                        console.log(currentAnswers)
                    }}>Убрать последний вариант ответа</Button>
                </>;
            case 3:
                return  <>
                    <Form.Label >Ответ</Form.Label>
                    <Form.Control key={0} type="text" value={currentAnswers[0]?currentAnswers[0].response:""} onChange={(e) => {
                        const array = [...currentAnswers];
                        array[0] = {
                            question: "",
                            response: e.target.value,
                            validResponse: true
                        };
                        setCurrentAnswers(array);
                       // console.log(currentAnswers);
                    }}/>
                </>;
            default:
                return <>
                    <Form.Label>Выберите тип теста чтобы создавать варианты ответов</Form.Label>
                </>;
        }
    };

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
                console.log(subjectsJson)
                setSubjects(subjectsJson)

                const response3 = await fetch(process.env.REACT_APP_SERVER_URL+'TypeTask/all');
                if (!response3.ok) {
                    throw new Error('Ошибка получения типов заданий');
                }

                const typeJson = await response3.json();
                console.log(typeJson)
                setTypes(typeJson)
              /*  if(editItem == null){
                    setCurrentType(typeJson[0].id);
                }*/


            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }
        async function setData() {
            if (editItem != null) { //выполняется если предается предмет который нужно изменить
                if (editItem.test != null) {
                    console.log("sub= " + editItem.test.theme.subject.id + "; theme= " + editItem.test.theme.id)
                    setTargetSubject(editItem.test.theme.subject.id);
                    setCurrentTheme(editItem.test.theme.id);
                } else {
                    setTargetSubject(-1);
                    setCurrentTheme(-1);
                }
                console.log(editItem.test);

                setCurrentType(editItem.typeTask.id);
                try {
                    const response2 = await fetch(process.env.REACT_APP_SERVER_URL+'task-of-indicator/find-indicator-by-task', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify({id:editItem.id})
                    });
                    if (!response2.ok) {
                        throw new Error('Ошибка получения предметов');
                    }

                    const indicatorsJson = await response2.json();
                    console.log(indicatorsJson)
                    indicatorsJson.map((item,index) => {
                        currentIndicators[item.id]=true;
                        notEditedIndicatros[item.id]=true;
                    })
                    if(indicatorsJson.length > 0){
                        setCurrentTheme(indicatorsJson[0].theme.id)
                        setTargetSubject(indicatorsJson[0].theme.subject.id)
                    }
                   // setNotEditedIndicatros(indicatorsJson);
                   // setIndicators(indicatorsJson)



                } catch (error) {
                    console.error('Ошибка получения данных:', error);
                }
                // setIndicators([]);
                setText(editItem.taskText);
                setExplanation(editItem.explanation);
                try {
                    const response2 = await fetch(process.env.REACT_APP_SERVER_URL+'response-option/find-response-option-by-task', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify({id:editItem.id})
                    });
                    if (!response2.ok) {
                        throw new Error('Ошибка получения предметов');
                    }

                    const responseOptionsJson = await response2.json();
                    console.log( responseOptionsJson)
                    setCurrentAnswers(responseOptionsJson)
                    setNotEditedAnswers(responseOptionsJson)


                } catch (error) {
                    console.error('Ошибка получения данных:', error);
                }
                // setCurrentAnswers([]);
            } else {
                setTargetSubject(-1);
               // setCurrentType(-1);
                setCurrentTheme(-1);
                setIndicators([]);
                setText("");
                setExplanation("");
                setCurrentAnswers([]);
               // setCurrentType(-1);
            }
        }
        fetchSubjects();
        setData();
    }, [editItem]);
    return (
        <div>
            <h1>{editItem ? "Редактирование задания" : "Создание задания"}</h1>
            <h3>Выберите предмет и тему задания</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Select value={targetSubject}
                        onChange={(e) => {
                            setTargetSubject(e.target.value);
                        }}>
                        <option value={-1}>Выберите предмет</option>
                        {subjects.map((item, index) => <option key={item.id}
                                                               value={item.id}> {item.subjectName/* + " " + item.teacherClass.studentClass.numberOfInstitution + item.teacherClass.studentClass.letterDesignation*/}  </option>)}

                    </Form.Select>
                </Form.Group>
                <ThemeAndIndicatorSelector needIndicators={true} targetSubject={targetSubject}
                                           indicators={currentIndicators}
                                           currentTheme={currentTheme}
                                           setIndicators={setIndicators}
                                           setCurrentTheme={setCurrentTheme}/>
                <Form.Group className="mb-3">
                    <Form.Select onChange={(e) => {
                        setCurrentType(e.target.value);
                        setCurrentAnswers([]);
                    }} value={currentType}>
                        <option value={-1}>Выберите тип задания</option>
                        {types.map((item, index) => <option key={item.id}
                                                            value={item.id}> {item.taskTypeName}  </option>)}

                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Текст задания</Form.Label>
                    <Form.Control value={currentText} as="textarea" rows={3} onChange={(e) => {
                        setText(e.target.value);
                    }}/>
                </Form.Group>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Добавить картинку</Form.Label>
                    <Form.Control type="file"/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Пояснение</Form.Label>
                    <Form.Control value={currentExplanation} as="textarea" rows={3} onChange={(e) => {
                        setExplanation(e.target.value);
                    }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    {renderAnswers()}
                </Form.Group>
                <Button variant="primary" className="custom-button-create-window" type="submit" onClick={() => {
                    //setShow(true); /*console.log(currentAnswers)*/
                }} >
                    {editItem==null?"Создать":"Редактировать"}
                </Button>
            </Form>

        </div>
    );
};

export default CreateQuestionPage;