import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import './styles.css';
import DisplayTestTextAnswers from "../DisplayTestTextAnswers";
import DisplayTestSelectManyAnswers from "../DisplayTestSelectManyAnswers";
import DisplayTestComparisonAnswers from "../DisplayTestComparisonAnswers"; // Импорт CSS файла для стилей компонента

const Question = ({ id, item, qStatus, view, answers, setAnswers, setActive, qsCount }) => {
    const [currentAnswers, setCurrentAnswers] = useState(answers);
    const [display, setDisplay] = useState();

    useEffect(() => {
      //  console.log(item)
        if(item!=undefined || item!=null){
            switch (item.typeTask.id){
                case 3:
                    setDisplay( <DisplayTestTextAnswers id={id} view={view}
                                       currentAnswers={currentAnswers}  setCurrentAnswers={setCurrentAnswers}
                                        answers={answers} setAnswers={setAnswers} qsCount={qsCount} setActive={setActive}/>)
                    break;
                case 2:
                    setDisplay(<DisplayTestSelectManyAnswers item={item} view={view} setAnswers={setAnswers}
                                                             qsCount={qsCount} setActive={setAnswers} answers={answers}/>)
                    break;
                case 1:
                    setDisplay(<DisplayTestComparisonAnswers item={item} view={view}/>)
                    break;
                default:
                    setDisplay(<p>Упс...</p>)
                    break;
            }
        }
    }, [item,currentAnswers,]);



    return (
        <div className={`question-container ${view ? (qStatus ? 'correct' : 'incorrect') : ''}`}>
            <div className="question-content">
                <h2 className="question-title">{item?item.taskName:""}</h2>
                <h3 className="question-text">{item?item.taskText:""}</h3>
            </div>
            <div className={`answer-section ${view ? (qStatus ? 'correct' : 'incorrect') : ''}`}>
                <Form>
                    {display}
                </Form>
            </div>
        </div>
    );
};

export default Question;
