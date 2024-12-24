import { React,useEffect, useState } from 'react';
import {Form, Button} from 'react-bootstrap';

const Question = ({id, qStatus ,name, description, view, answers, setAnswers}) => {
    const [currentAnswers, setCurrentAnswers] = useState(answers);

    //console.log("answer " + answer);
    const onClick =(id,answer)=>{
        const array = [...answers]

        array[id] = answer;
        setAnswers(array)

    }
    const handleInputChange =(id,answer)=>{
        const array = [...currentAnswers]
        array[id] = answer;
        setCurrentAnswers(array)
    }

    return (
        <div>
            <h2>{name} ({view?qStatus?"True":"False":"" })</h2>
            <h3>{description}</h3>
            <Form>
                {view ? (<Form.Control type="text" placeholder="Ответ"  required readOnly  /> ):
                    (<Form.Control type="text" placeholder="Ответ" value={currentAnswers[id] || ""} onChange={(e)=>{handleInputChange(id,e.target.value) /*setAnswer(e.target.value)*/}}  required  />)}
                {view ? (<></> ): (<Button onClick={() => onClick(id,currentAnswers[id])} display={view ? "none" : ""} >Ответить</Button>)}
            </Form>
        </div>
    );
};

export default Question;
