import React from 'react';
import {Table,Button} from 'react-bootstrap';
import Question from "../Question";

const ViewTestResultsPage = (props) => {
    return (
        <div>
            <h1>Тренажер по теме "Гипотенуза"</h1>
            <div>
                <h2>Ваш результат:</h2>
                <Table>
                    <tbody>
                    <tr>
                        <td>Всего вопросов:</td>
                        <td id="countOfQuestions">3</td>
                    </tr>
                    <tr>
                        <td>Оценка:</td>
                        <td id="score"> 66.66 из 100</td>
                    </tr>
                    </tbody>
                </Table>
                <Question id="1"></Question>
                <Question id="2"></Question>
                <Question id="3"></Question>
                <Button>Закончить обзор</Button>
            </div>
        </div>
);
};

export default ViewTestResultsPage;