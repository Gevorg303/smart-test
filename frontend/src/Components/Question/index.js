import { React,useEffect, useState } from 'react';
import {Form, Button} from 'react-bootstrap';

const Question = (props) => {

    useEffect( () => {

    });

    return (
        <div>
            <h2>Вопрос {props.id} </h2>
            <h3>{props.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. </h3>
            <Form >
                {props.view === "true" ? (<Form.Control type="text" placeholder="Ответ" required readOnly  /> ): (<Form.Control type="text" placeholder="Ответ" required  />)}
                {props.view === "true" ? (<></> ): (<Button display={props.view === "true" ? "none" : ""} id="AnswerButton">Ответить</Button>)}
            </Form>
        </div>
    );
};

export default Question;