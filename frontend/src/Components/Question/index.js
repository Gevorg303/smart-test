import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import './styles.css'; // Импорт CSS файла для стилей компонента

const Question = ({ id, qStatus, name, description, view, answers, setAnswers,setActive ,qsCount}) => {
    const [currentAnswers, setCurrentAnswers] = useState(answers);

    const onClick = (id, answer) => {
        const array = [...answers];
        array[id] = answer;
        setAnswers(array);
        setActive(prev=>qsCount===prev+1?prev:prev+1)
    };

    const handleInputChange = (id, answer) => {
        const array = [...currentAnswers];
        array[id] = answer;
        setCurrentAnswers(array);
    };

    return (
        <div className="question-container">
            <div className="question-content">
                <h2>{name} {qsCount} {view ? qStatus ? "(True)" : "(False)" : ""}</h2>
                <h3>{description}</h3>
            </div>
            <div className="answer-section">
                <Form>
                    {view ? (
                        <Form.Control type="text"
                                      placeholder="Ответ"
                                      value={currentAnswers[id] || ""}
                                      onChange={(e) => handleInputChange(id, e.target.value)}
                                      required readOnly />

                    ) : (
                        <Form.Control
                            type="text"
                            placeholder="Ответ"
                            value={currentAnswers[id] || ""}
                            onChange={(e) => handleInputChange(id, e.target.value)}
                            required
                        />
                    )}
                    <br/>
                    {view ? (
                        <></>
                    ) : (
                        <Button className="answer-button" onClick={() => onClick(id, currentAnswers[id])}>Ответить</Button>
                    )}
                </Form>
            </div>
        </div>
    );
};

export default Question;
