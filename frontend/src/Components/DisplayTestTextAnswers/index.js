import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const DisplayTestTextAnswers = ({id, item,view,currentAnswers,setAnswers,answers,setActive,qsCount}) => {

    const [userAnswer, setUserAnswer] = useState('');

    const handleInputChange = (answer) => {
       /* const array = [...currentAnswers];
        array[id] = answer;
        setCurrentAnswers(array);
        setUserAnswer(answer);*/
        const find = currentAnswers.find(el => el.task.id===item.id);
        if(find != undefined) {
            currentAnswers[currentAnswers.indexOf(find)] =
            {
                task:{id:item.id},
                responseOption:[
                    {
                        question: null,
                        response: answer,
                    }
                ]
            }
        } else{
            currentAnswers.push(
                {
                task:{id:item.id},
                responseOption:[
                    {
                        question: null,
                        response: answer,
                    }
                ]
                }
            );
        }
        setUserAnswer(answer);
        console.log(answer)
        console.log(currentAnswers)
    };

    const onClick = () => {
       /* const array = [...answers];
        array[id] = answer;
        setAnswers(array);*/
        setAnswers(currentAnswers);
        setActive(prev => qsCount === prev + 1 ? prev : prev + 1);
    };

    useEffect(() => {
        if (view && Array.isArray(currentAnswers) && item && item.id) {
            const find = currentAnswers.find(el => el.task && el.task.id === item.id);
            if (find) {
                setUserAnswer(currentAnswers[currentAnswers.indexOf(find)].responseOption[0].response);
            }
        }
    }, [view, currentAnswers, id, item]);


    useEffect(() => {
        if (answers != undefined) {
            const find = answers.find(el => el.task.id===item.id);
            if(find==undefined){
                currentAnswers.push(
                    {
                        task:{id:item.id},
                        responseOption:[
                            {
                                question: null,
                                response: "",
                            }
                        ]
                    }
                );
                setUserAnswer("");
                setAnswers(currentAnswers);
            }

        }

    }, [id,answers]);
    return (
        <>
            <Form.Group className="answer-group">
                <Form.Label className="answer-label">Ответ:</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Ответ"
                    value={view ? userAnswer : (currentAnswers[currentAnswers.indexOf(currentAnswers.find(el => el.task.id===item.id))]!=undefined?currentAnswers[currentAnswers.indexOf(currentAnswers.find(el => el.task.id===item.id))].responseOption[0].response:"" || "")}
                    onChange={(e) => handleInputChange( e.target.value)}
                    required
                    readOnly={view}
                />
            </Form.Group>
            <br />
            {view ? (
                <></>
            ) : (
                <Button className="answer-button" onClick={() => onClick()}>Ответить</Button>
            )}
        </>
    );
};

export default DisplayTestTextAnswers;