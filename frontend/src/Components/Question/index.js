import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import './styles.css'; // Импорт CSS файла для стилей компонента

const Question = ({ id, qStatus, name, description, view, answers, setAnswers, setActive, qsCount }) => {
    const [currentAnswers, setCurrentAnswers] = useState(answers);
    const [userAnswer, setUserAnswer] = useState('');

    useEffect(() => {
        if (view) {
            setUserAnswer(currentAnswers[id]);
        }
    }, [view, currentAnswers, id]);

    const onClick = (id, answer) => {
        const array = [...answers];
        array[id] = answer;
        setAnswers(array);
        setActive(prev => qsCount === prev + 1 ? prev : prev + 1);
    };

    const handleInputChange = (id, answer) => {
        const array = [...currentAnswers];
        array[id] = answer;
        setCurrentAnswers(array);
        setUserAnswer(answer);
    };

    return (
        <div className={`question-container ${view ? (qStatus ? 'correct' : 'incorrect') : ''}`}>
            <div className="question-content">
                <h2 className="question-title">{name}</h2>
                <h3 className="question-text">{description}</h3>
            </div>
            <div className={`answer-section ${view ? (qStatus ? 'correct' : 'incorrect') : ''}`}>
                <Form>
                    <Form.Group className="answer-group">
                        <Form.Label className="answer-label">Ваш ответ:</Form.Label>
                        {view ? (
                            <div className="answer-display">{userAnswer}</div>
                        ) : (
                            <Form.Control
                                type="text"
                                placeholder="Ответ"
                                value={currentAnswers[id] || ""}
                                onChange={(e) => handleInputChange(id, e.target.value)}
                                required
                            />
                        )}
                    </Form.Group>
                    <br />
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
