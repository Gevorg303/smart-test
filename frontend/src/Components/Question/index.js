import { React,useEffect, useState } from 'react';
import {Form, Button} from 'react-bootstrap';

const Question = ({id, description, answer, view,onClick}) => {
    const [answerState, setAnswer] = useState("");

    useEffect( () => {
        console.log(answerState)
    });

    return (
        <div>
            <h2>Вопрос {id} </h2>
            <h3>{description} Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. </h3>
            <Form >
                {view === "true" ? (<Form.Control type="text" placeholder="Ответ"  required readOnly  /> ): (<Form.Control type="text" placeholder="Ответ" value={answerState}  onChange={(e)=>{setAnswer(e.currentTarget.value)}} required  />)}
                {view === "true" ? (<></> ): (<Button display={view === "true" ? "none" : ""} >Ответить</Button>)}
            </Form>
        </div>
    );
};

export default Question;