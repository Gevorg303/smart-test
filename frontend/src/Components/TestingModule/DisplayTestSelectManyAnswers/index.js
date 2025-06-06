import React, { useEffect, useState } from 'react';
import { Form, Button, Stack} from 'react-bootstrap';

const DisplayTestSelectManyAnswers =({id, item,view,currentAnswers,answers,setAnswers,setActive,qsCount}) => {
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

    const onClickNext = () => {
       /* const array = [...userAnswer];
        array[id] = !array[id]?true:undefined;
        setUserAnswer(array);*/
      //  console.log(array)
       // console.log(answers)
        setAnswers(currentAnswers);
        setActive(prev => qsCount === prev + 1 ? prev : prev + 1);
    };

    useEffect(() => {
        async function fetchAnswers() {
            try {

                const response = await fetch(process.env.REACT_APP_SERVER_URL+'response-option/find-response-option-by-task', {
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
                    const array =[]
                    if(currentAnswers.length>0 && find != undefined){
                        responseOptions.map((item,index)=>{
                            const findAnsw = currentAnswers[currentAnswers.indexOf(find)].responseOption.find(el => el.id ===item.id)
                            if(findAnsw != undefined){
                                array.push(findAnsw);
                            } else {
                                array.push({
                                    id: item.id,
                                    question: null,
                                    response: item.response,
                                    validResponse: false
                                });
                            }

                        })
                    } else {
                        responseOptions.map((item,index)=>{
                            array.push({
                                id: item.id,
                                question: null,
                                response: item.response,
                                validResponse: false
                            });
                        })
                    }
                    setUserAnswer(array)

                    const findCurAnsw = currentAnswers.find(el => el.task.id===item.id);
                    if(findCurAnsw != undefined) {
                        currentAnswers[currentAnswers.indexOf(findCurAnsw)] =
                            {
                                task:{id:item.id},
                                responseOption:array
                            }
                    } else{
                        currentAnswers.push(
                            {
                                task:{id:item.id},
                                responseOption:array
                            }
                        );
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

    useEffect(() => {
        if (answers != undefined) {
           // console.log(answers)
            const find = answers.find(el => el.task.id===item.id);
            if(find==undefined){
                currentAnswers.push(
                    {
                        task:{id:item.id},
                        responseOption:userAnswer
                    }
                );
                setAnswers(currentAnswers);
                //console.log("do some")
            }

        }

    }, [answers]);

    return (
        <>
                {responseOptions.length > 0 ?
                    responseOptions.map((item, index) => <Stack direction="horizontal" gap={1}>

                        <Form.Check // prettier-ignore
                            key={item.id}
                            type={'checkbox'}
                            id={item.id}
                            name="responseOption"
                            /*label={item.response}*/
                            disabled={view}
                            onCopy={e => e.preventDefault()}
                            checked={userAnswer[index] !== undefined ? userAnswer[index].validResponse : false}
                            onChange={(e) => {
                                handleInputChange(item.id, item.response, e.target.checked)
                            }}
                        />
                            <label onCopy={e => e.preventDefault()}>{item.response}</label>
                    </Stack>
                    )
                    :
                    <h5> Нет вариантов ответа</h5>
                }
            {view ? (
                <></>
            ) : (
                <Button className="answer-button" onClick={onClickNext}>Ответить</Button>
            )}
        </>
    );
};

export default DisplayTestSelectManyAnswers;