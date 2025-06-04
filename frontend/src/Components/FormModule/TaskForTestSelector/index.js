import {Reactm, useState,useEffect }from 'react';
import { Form, Button, Stack } from 'react-bootstrap';
import "./styles.css";

const TaskForTestSelector = ({id,task,answers, setAnswers}) => {

    const [currentCheck, setCurrentCheck] = useState(answers.find(el => el.id === id)===undefined?false:true);

    const onClick = (id,isAdd) => {
      /*  const array = [...answers];
        array[id] = answer;
        setAnswers(array);*/

       // console.log(array)
        let find = answers.find(el => el.id === id)
        if(find == undefined ) {
           // if(isAdd){
                answers.push({id: id});
                setAnswers(answers)
                console.log("задание добавлено")
          //  }

        } else {

                setAnswers(
                    answers.filter(function(item) {
                        return item.id !== id
                    })
                )
                console.log("задание убрано")

        }

    };

    useEffect(() => {
        if(answers != []){
            setAnswers(answers);
        }

    }, [answers]);

    return (
        <div className={"task-for-test-selector-card"}>
            <Stack direction={"horizontal"} gap={3}>
                <Form.Check // prettier-ignore
                    key={id}
                    type={'checkbox'}
                    id={id}
                    name="task"
                    checked={currentCheck}
                    onChange={(e)=>{
                        // if(!currentCheck){

                        onClick(id,true);
                        /* }
                         else {
                             onClick(id,false);
                         }*/
                        setCurrentCheck(!currentCheck)
                    }}
                />
                <Form.Check.Label>
                    <h2>Задание №{task.id}</h2>
                    <h3>{task.taskText}</h3>
                </Form.Check.Label>

            </Stack>

        </div>
    );
};

export default TaskForTestSelector;