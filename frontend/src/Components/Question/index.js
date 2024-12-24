import { React,useEffect, useState } from 'react';
import {Form, Button} from 'react-bootstrap';

const Question = ({id,name, description, view, answers, setAnswers}) => {
    const [answer, setAnswer] = useState(answers[id] || "");

    useEffect( () => {
       console.log(answers)
    },[]);

    const onClick =(id,answer)=>{
        const array = [...answers]
        console.log(array[id])
        array[id] = answer;
        setAnswers(array)
        console.log(array[id])
       // console.log(answers)
      //  console.log(answer + " сохранен в " + id)
      //  console.log(answers)
      /*  setAnswers(prev =>
           prev[id] = answer
        );
        console.log(answers)*/
    }

    return (
        <div>
            <h2>{name} </h2>
            <h3>{description}</h3>
            <Form >
                {view ? (<Form.Control type="text" placeholder="Ответ"  required readOnly  /> ):
                    (<Form.Control type="text" placeholder="Ответ" value={answer} onChange={(e)=>{setAnswer(e.target.value)}}  required  />)}
                {view ? (<></> ): (<Button onClick={() => onClick(id,answer)} display={view ? "none" : ""} >Ответить</Button>)}
            </Form>
        </div>
    );
};

export default Question;