import React from 'react';
import { Button, Table } from 'react-bootstrap';

const TestAttemptsDisplay = ({attempts}) => {

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        timezone: 'UTC',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };
    return (
        <>
            {attempts.length > 0
                ?
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Попытка</th>
                            <th>Дата окончания</th>
                            <th>Длительность попытки</th>
                            <th>Результат</th>
                        </tr>
                        </thead>
                        <tbody>
                        {attempts.map((item, index) => <tr>
                            <td>{index + 1}</td>
                            <td>{new Date(item.startDateTime).toLocaleString("ru", options)}</td>
                            <td>{item.attemptDuration}</td>
                            <td>{item.testResult}/100</td>
                        </tr>)}
                        </tbody>
                    </Table>
                :
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th> Попытки теста отсутсвуют.</th>
                    </tr>
                    </thead>
                </Table>
            }

        </>
    );
};

export default TestAttemptsDisplay;