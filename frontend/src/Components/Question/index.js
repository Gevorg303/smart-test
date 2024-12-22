import { React,useEffect, useState } from 'react';
import {Form, Button} from 'react-bootstrap';

const Question = ({id, description, view, answers, setAnswers}) => {
    const [answer, setAnswer] = useState(answers[id] || "");

    useEffect( () => {
        console.log(answer)
    });

    const onClick =(id,answer)=>{
        const array = [...answers]
        array[id] = answer;
        setAnswers(array)
    }

    return (
        <div>
            <h2>Вопрос {id} </h2>
            <h3>{description} Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. </h3>
            <Form >
                {view ? (<Form.Control type="text" placeholder="Ответ"  required readOnly  /> ):
                    (<Form.Control type="text" placeholder="Ответ" value={answer} onChange={(e)=>{setAnswer(e.target.value)}}  required  />)}
                {view ? (<></> ): (<Button onClick={() => onClick(id,answer)} display={view ? "none" : ""} >Ответить</Button>)}
            </Form>
        </div>
    );
};

export default Question;