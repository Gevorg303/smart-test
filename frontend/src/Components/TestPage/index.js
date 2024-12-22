import { React,useEffect, useState } from 'react';
import Question from "../Question";
import {Button, Pagination} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const TestPage = () => {

    let navigate = useNavigate();
    const [active, setActive] = useState(0);
    let count = 4; // количество вопросов
    let questions = []; //заполняем массив с вопросами из теста
    for (let number = 0; number < count; number++) {
        questions.push(
            <Question id={number+1} description={number+1+" description"}  />
        );
    }
    let paginationItems =[] //заполняем массив с кнопками для пагинации
    for (let number = 0; number < count; number++) {
        paginationItems.push(
            <Pagination.Item key={number} active={number === active} onClick={() => setActive(number) }>
                {number+1}
            </Pagination.Item>
        );
    }
    function TestEnd()
    {
        //
        navigate("/testresult");
    }

    return (
        <div>
            <h1>Контрольный тест</h1>
            {questions[active]}
            <Pagination>
                <Pagination.Prev onClick={() => { if(active != 0)setActive(active - 1 )}}/>
                {paginationItems}
                <Pagination.Next onClick={() => { if(active < count-1)setActive(active + 1 )}}/>
            </Pagination>
            <Button onClick={() =>TestEnd()}>Завершить тест</Button>
        </div>
    );
};

export default TestPage;