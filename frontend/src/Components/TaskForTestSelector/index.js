import {Reactm, useState }from 'react';
import { Form, Button } from 'react-bootstrap';

const TaskForTestSelector = ({id,task,answers, setAnswers}) => {

    const [currentCheck, setCurrentCheck] = useState(false);

    const onClick = (id, answer) => {
        const array = [...answers];
        array[id] = answer;
        setAnswers(array);
        console.log("ЗАДАНИЯ В ТЕСТЕ")
        console.log(array)
    };
    return (
        <>
            <Form.Check // prettier-ignore
                key={id}
                type={'checkbox'}
                id={id}
                name="task"
                checked={currentCheck}
                onChange={(e)=>{
                    if(!currentCheck){

                       onClick(id,{  // checked={answers[id].evaluationResponse==100?true:false}
                        id: id
                    });
                   }
                   else {
                       onClick(id,undefined);
                   }
                    setCurrentCheck(!currentCheck)
                }}
            />
            <Form.Check.Label>
                <h2>Задание №{task.id}</h2>
                <h3>{task.taskText}</h3>
                </Form.Check.Label>

        </>
    );
};

export default TaskForTestSelector;