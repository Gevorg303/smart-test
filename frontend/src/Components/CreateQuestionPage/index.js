import React, { useState, useEffect } from 'react';
import { Form, Button,Toast,ToastContainer } from 'react-bootstrap';
import ThemeAndIndicatorSelector from "../ThemeAndIndicatorSelector";
import FormSelectAnswer from "../FormSelectAnswer";



const CreateQuestionPage = ({editItem, onCreate}) => {
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

        if (errors.length > 0) {
            // Вывести сообщение об ошибке
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

                    responseOption: currentAnswers
                    ,
                    indicator: indicators
                }

            );
             const response = await fetch('http://localhost:8080/task/add', {
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
            let toastText;
            if (!response.ok) {
                toastText = "Ошибка создния задания";
                throw new Error();
            }
            toastText = "Задание создано";
            onCreate(toastText);
        } catch (error) {
            console.error('Ошибка отправки данных:', error);
        }
    }

    const renderAnswers = () => {
        switch (currentType) {
           /* case "1":
                return <>
                    <Form.Label>Ответы</Form.Label>
                    <Form.Control type="text"/>
                </>;*/
            case "2":
                return  <>
                    <Form.Label>Ответы для выбора:</Form.Label>
                    {currentAnswers.map((item, index) =>
                        <FormSelectAnswer key={index} id={index} isMultiple={true} answers={currentAnswers} setAnswers={setCurrentAnswers}/>
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
            case "3":
                return  <>
                    <Form.Label >Ответ</Form.Label>
                    <Form.Control key={0} type="text" onChange={(e) => {
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
                    <Form.Label>Ответы для сопоставления:</Form.Label>
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
        }
    };

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

                const response3 = await fetch('http://localhost:8080/TypeTask/all');
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
        if(editItem!=null){ //выполняется если предается предмет который нужно изменить
            if(editItem.test!=null) {
                console.log("sub= "+editItem.test.theme.subject.id+"; theme= "+editItem.test.theme.id)
                setTargetSubject(editItem.test.theme.subject.id);
                setCurrentTheme(editItem.test.theme.id);
            }else {
                setTargetSubject(-1);
                setCurrentTheme(-1);
            }

            setCurrentType(editItem.typeTask.id);
           // setIndicators([]);
            setText(editItem.taskText);
            setExplanation(editItem.explanation);
           // setCurrentAnswers([]);
        }
        else {
            setTargetSubject(-1);
            setCurrentType(-1);
            setCurrentTheme(-1);
            setIndicators([]);
            setText("");
            setExplanation("");
            setCurrentAnswers([]);
            setCurrentType(-1);
        }
        fetchSubjects();
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
                <Button variant="primary" type="submit" onClick={() => {
                    //setShow(true); /*console.log(currentAnswers)*/
                }}>
                    {editItem==null?"Создать":"Редактировать"}
                </Button>
            </Form>

        </div>
    );
};

export default CreateQuestionPage;