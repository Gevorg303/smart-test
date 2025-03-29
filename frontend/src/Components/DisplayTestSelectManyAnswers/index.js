import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const DisplayTestSelectManyAnswers = ({id,item,view }) => {
    const [responseOptions,setResponseOptions] = useState([]);
    const [userAnswer, setUserAnswer] = useState([]);


    const onClick = (id) => {
        const array = [...userAnswer];
        array[id] = !array[id]?true:undefined;
        setUserAnswer(array);
      //  console.log(array)
    };

    useEffect(() => {
        async function fetchAnswers() {
            try {

                const response = await fetch('http://localhost:8080/response-option/find-response-option-by-task', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify({id:item.id})
                });
                const responseOptions = await response.json();
                console.log(responseOptions)
                setResponseOptions(responseOptions)

            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }

        fetchAnswers();
    }, []);

    return (
        <>
                {responseOptions.length > 0 ?
                    responseOptions.map((item, index) => <Form.Check // prettier-ignore
                            key={item.id}
                            type={'checkbox'}
                            id={item.id}
                            name="responseOption"
                            label={item.response}
                            disabled={view}
                            checked={userAnswer[item.id]}
                            onChange={() => {onClick(item.id)}}
                        />
                    )
                    :
                    <h5> Нет вариантов ответа</h5>
                }
            {view ? (
                <></>
            ) : (
                <Button className="answer-button" onClick={() => {/*onClick(id, currentAnswers[id])}*/}}>Ответить</Button>
            )}
        </>
    );
};

export default DisplayTestSelectManyAnswers;