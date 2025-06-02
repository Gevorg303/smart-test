import React from 'react';
import {Button,Table} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const ResultTable = (props) => {

    let testTrys = [];
    let navigate = useNavigate();
    for (let number = 0; number < props.tryCount; number++) {
        testTrys.push(
            <tr>
                <td>{number+1}</td>
                <td>33/100</td>
                <td>
                    <Button onClick={()=>{
                        navigate("/testresult")// добавить id попытки
                    }}>Просмотр</Button>
                </td>
            </tr>
        );
    }

    return (
        <div>
            <h4>Количество попыток: {props.tryCount}</h4>
            <h2>Результаты ваших предыдущих попыток</h2>
            <Table>
                <thead>
                <td>Попытка</td>
                <td>Оценка</td>
                <td>Просмотр</td>
                </thead>
                <tbody>
                {testTrys}
                </tbody>
            </Table>
        </div>
    );
};

export default ResultTable;