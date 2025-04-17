import React from 'react';
import { Form } from 'react-bootstrap';

const FormSelectAnswer = ({id,isMultiple,answers, setAnswers }) => {

    const onClick = (id, answer) => {
        const array = [...answers];
        array[id] = answer;
        setAnswers(array);
    };

    return (
        <>
            {
                isMultiple?
                    <>
                        <Form.Label>Текст:</Form.Label>
                        <Form.Control type="text" value={answers[id].response} onChange={(e)=>{
                            onClick(id,{
                                question: "",
                                response: e.target.value,
                                validResponse: answers[id].validResponse
                            });
                        }} ></Form.Control>
                        <Form.Label>Верный:</Form.Label>
                        <Form.Check // prettier-ignore
                            key={id}
                            type={'checkbox'}
                            id={id}
                            name="answer"
                            checked={answers[id].validResponse}
                            onChange={(e)=>{
                                onClick(id,{
                                    question: "",
                                    response: answers[id].response,
                                    validResponse: answers[id].validResponse
                                });
                            }}
                        />
                    </>
                    :
                    <>
                        <Form.Label>Текст:</Form.Label>
                        <Form.Control type="text" value={answers[id].question} onChange={(e)=>{
                            onClick(id,{
                                question: e.target.value,
                                response: answers[id].response,
                                validResponse: true
                            });
                        }}></Form.Control>
                        <Form.Label>Вариант ответа: </Form.Label>
                        <Form.Control type="text" value={answers[id].response} onChange={(e)=>{
                            onClick(id,{
                                question: answers[id].question,
                                response: e.target.value,
                                validResponse: true
                            });
                        }}></Form.Control>
                    </>

            }

        </>
    );
};

export default FormSelectAnswer;