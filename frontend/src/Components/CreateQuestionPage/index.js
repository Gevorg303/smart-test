import React, { useState, useEffect } from 'react';
import { Form, Button,Toast,ToastContainer } from 'react-bootstrap';
import ThemeAndIndicatorSelector from "../ThemeAndIndicatorSelector";
import FormSelectAnswer from "../FormSelectAnswer";



const CreateQuestionPage = () => {
    const [subjects, setSubjects] = useState([]);
    const [types, setTypes] = useState([]);
    const [targetSubject, setTargetSubject] = useState(0);
    const [show, setShow] = useState(false);
    const [toastText, setToastText] = useState("");

    const [currentType, setCurrentType] = useState();
   // const [currentSubject, setCurrentSubject] = useState();
    const [currentTheme, setCurrentTheme] = useState();
    const [currentIndicators, setIndicators] = useState([]);
    const [currentText, setText] = useState();
    const [currentExplanation, setExplanation] = useState();
    const [currentAnswers,setCurrentAnswers] = useState([]);

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
                        explanation: currentText,
                        taskText: currentExplanation
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
                            explanation: currentText,
                            taskText: currentExplanation
                        },

                        responseOption: currentAnswers
                        ,
                        indicator: indicators
                    }
                )
            });
            if (!response.ok) {
                setToastText("Ошибка создния задания");
                throw new Error();
            }
            setToastText("Задание создано");
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
                            evaluationResponse: "0"
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
                            evaluationResponse: "100"
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
                            evaluationResponse: "0"
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

                const response2 = await fetch(`http://localhost:8080/subject/${user.login}`);
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
                setCurrentType(typeJson[0].id);


            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }
        fetchSubjects();
    }, []);
    return (
        <div>
            <h1>Создание задания</h1>
            <h3>Выберите предмет и тему задания</h3>
            <Form  onSubmit={handleSubmit}>
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
                <ThemeAndIndicatorSelector needIndicators={true} targetSubject={targetSubject} indicators={currentIndicators} setIndicators={setIndicators}
                                            setCurrentTheme={setCurrentTheme}/>
                <Form.Group className="mb-3">
                    <Form.Select onChange={(e) => {
                        setCurrentType(e.target.value);
                        setCurrentAnswers([]);
                    }}>

                        {types.map((item, index) => <option key={item.id} value={item.id}> {item.taskTypeName}  </option>)}

                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Текст задания</Form.Label>
                    <Form.Control value={currentText} as="textarea" rows={3} onChange={(e) => {setText(e.target.value);}}/>
                </Form.Group>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Добавить картинку</Form.Label>
                    <Form.Control type="file" />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Пояснение</Form.Label>
                    <Form.Control value={currentExplanation} as="textarea" rows={3} onChange={(e) => {setExplanation(e.target.value);}}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    {renderAnswers()}
                </Form.Group>
                <Button variant="primary" type="submit"  onClick={()=>{setShow(true); /*console.log(currentAnswers)*/}}>
                    Создать
                </Button>
            </Form>
            <ToastContainer
                className="p-3"
                position={'middle-center'}
                style={{ zIndex: 1 }}
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

export default CreateQuestionPage;