import React from 'react';
import {Form, Button} from 'react-bootstrap';

const Question = (props) => {
    return (
        <div>
            <h2>Вопрос {props.id} </h2>
            <h3>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. </h3>
            <Form>
                <Form.Control type="text" placeholder="Ответ" required/>
                <Button>Ответить</Button>
            </Form>
        </div>
    );
};

export default Question;