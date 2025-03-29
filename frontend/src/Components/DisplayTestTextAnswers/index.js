import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const DisplayTestTextAnswers = ({id,view,currentAnswers,setCurrentAnswers,setAnswers,setActive,qsCount,answers}) => {

    const [userAnswer, setUserAnswer] = useState('');

    const handleInputChange = (id, answer) => {
        const array = [...currentAnswers];
        array[id] = answer;
        setCurrentAnswers(array);
        setUserAnswer(answer);
        console.log(answer)
        console.log(currentAnswers)
    };

    const onClick = (id, answer) => {
        const array = [...answers];
        array[id] = answer;
        setAnswers(array);
        setActive(prev => qsCount === prev + 1 ? prev : prev + 1);
    };

    useEffect(() => {
        if (view) {
            setUserAnswer(currentAnswers[id]);
        }

    }, [view, currentAnswers, id]);
    return (
        <>
            <Form.Group className="answer-group">
                <Form.Label className="answer-label">Ответ:</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Ответ"
                    value={view ? userAnswer : (currentAnswers[id] || "")}
                    onChange={(e) => handleInputChange(id, e.target.value)}
                    required
                    readOnly={view}
                />
            </Form.Group>
            <br />
            {view ? (
                <></>
            ) : (
                <Button className="answer-button" onClick={() => onClick(id, currentAnswers[id])}>Ответить</Button>
            )}
        </>
    );
};

export default DisplayTestTextAnswers;