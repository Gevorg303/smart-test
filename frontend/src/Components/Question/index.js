import React, { useEffect, useState } from 'react';
import { Form, Button, Badge } from 'react-bootstrap';
import './styles.css';
import DisplayTestTextAnswers from "../DisplayTestTextAnswers";
import DisplayTestSelectManyAnswers from "../DisplayTestSelectManyAnswers";
import DisplayTestComparisonAnswers from "../DisplayTestComparisonAnswers"; // Импорт CSS файла для стилей компонента

const Question = ({ id, item, taskScore, view, isTraining, answers, setAnswers, setActive, qsCount }) => {
    const [currentAnswers, setCurrentAnswers] = useState(answers);
    const [qStatus, setQStatus] = useState()
    const [display, setDisplay] = useState();

    useEffect(() => {
      //  console.log(item)
       // qStatus={validList.responseForTask!=undefined?(validList.responseForTask[index].taskScore!== undefined?validList.responseForTask[index].taskScore==100?true:false:false):false}

        if(item!=undefined || item!=null){
            setQStatus(taskScore ? (taskScore == 100?true : false) : false)
            switch (item.typeTask.id){
                case 3:
                    setDisplay( <DisplayTestTextAnswers id={id} item={item} view={view}
                                       currentAnswers={currentAnswers} setAnswers={setAnswers} answers={answers}
                                                        qsCount={qsCount} setActive={setActive}/>)
                    break;
                case 2:
                    setDisplay(<DisplayTestSelectManyAnswers id={id} item={item} view={view} setAnswers={setAnswers} answers={answers}
                                                             qsCount={qsCount} currentAnswers={currentAnswers}  setActive={setActive} />)
                    break;
                case 1:
                    setDisplay(<DisplayTestComparisonAnswers id={id} item={item} view={view} setAnswers={setAnswers} answers={answers}
                                                             qsCount={qsCount} currentAnswers={currentAnswers}  setActive={setActive}/>)
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
                <h2 className="question-title">{item ? item.taskName : ""}</h2>
                <h3 className="question-text">{item ? item.taskText : ""}</h3>
            </div>
            <div className={`answer-section ${view ? (qStatus ? 'correct' : 'incorrect') : ''}`}>
                <Form>
                    {display}
                </Form>
                <h1> {qStatus} </h1>
            </div>
            {view && item && taskScore !==undefined
                ?

                    <div className={`answer-section-addition-info ${view ? (qStatus ? 'correct' : 'incorrect') : ''}`}>
                        <Badge bg={qStatus?"success":"danger"}>Баллы: {taskScore}</Badge>
                        { item.explanation != "" && isTraining ? "Пояснение: " + item.explanation : "" }

                    </div>
                :
                <></>
            }

        </div>
    );
};

export default Question;
