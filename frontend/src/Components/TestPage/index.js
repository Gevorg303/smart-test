import React from 'react';
import Question from "../Question";
import {Button} from 'react-bootstrap';

const TestPage = () => {
    return (
        <div>
            <h1>Контрольный тест</h1>
            <Question id="1"/>
            <Button>Предыдущий вопрос</Button>
            <Button>Следующий вопрос</Button>
        </div>
    );
};

export default TestPage;