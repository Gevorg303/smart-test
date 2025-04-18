import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const DisplayTestSelectManyAnswers =({id, item,view,currentAnswers,setAnswers,setActive,qsCount}) => {
    const [responseOptions,setResponseOptions] = useState([]);
    const [userAnswer, setUserAnswer] = useState([]);

    const handleInputChange = (id,answer,target) => {
       // const targetBool = target==='on'?true:false;
       // const array = [...userAnswer];
        const findansw = userAnswer.find(el => el.id===id);
        if(findansw != undefined) {
            userAnswer[userAnswer.indexOf(findansw)] =
                {
                    id: id,
                    question: null,
                    response: answer,
                    validResponse: target
                }
        }
        const array = [...userAnswer];
        console.log(findansw)
        setUserAnswer(array);
        console.log(userAnswer)

        const find = currentAnswers.find(el => el.task.id===item.id);
        if(find != undefined) {
            currentAnswers[currentAnswers.indexOf(find)] =
                {
                    task:{id:item.id},
                    responseOption:userAnswer
                }
        } else{
            currentAnswers.push(
                {
                    task:{id:item.id},
                    responseOption:userAnswer
                }
            );
        }

        console.log(id+" "+answer + " "+target )
        console.log(currentAnswers)
    };

    const onClick = () => {
       /* const array = [...userAnswer];
        array[id] = !array[id]?true:undefined;
        setUserAnswer(array);*/
      //  console.log(array)
        setAnswers(currentAnswers);
        setActive(prev => qsCount === prev + 1 ? prev : prev + 1);
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
                const find = currentAnswers.find(el => el.task.id===item.id);
                if(!view){
                    if(currentAnswers.length>0 && find != undefined){
                        responseOptions.map((item,index)=>{
                            const findAnsw = currentAnswers[currentAnswers.indexOf(find)].responseOption.find(el => el.id ===item.id)
                            if(findAnsw != undefined){
                                userAnswer.push(findAnsw);
                            } else {
                                userAnswer.push({
                                    id: item.id,
                                    question: null,
                                    response: item.response,
                                    validResponse: false
                                });
                            }

                        })
                    } else {
                        responseOptions.map((item,index)=>{
                            userAnswer.push({
                                id: item.id,
                                question: null,
                                response: item.response,
                                validResponse: false
                            });
                        })
                    }
                } else{

                    if(find != undefined){
                        setUserAnswer(currentAnswers[currentAnswers.indexOf(find)].responseOption);
                    }
                    console.log(find)
                    console.log(currentAnswers[currentAnswers.indexOf(find)].responseOption)
                    //setUserAnswer(currentAnswers);
                }



            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }

        fetchAnswers();
    }, [item]);

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
                            checked={userAnswer[index].validResponse}
                            onChange={(e) => {handleInputChange(item.id,item.response,e.target.checked)}}
                        />
                    )
                    :
                    <h5> Нет вариантов ответа</h5>
                }
            {view ? (
                <></>
            ) : (
                <Button className="answer-button" onClick={() => {onClick()}}>Ответить</Button>
            )}
        </>
    );
};

export default DisplayTestSelectManyAnswers;