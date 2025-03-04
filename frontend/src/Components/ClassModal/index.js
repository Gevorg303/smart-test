import React from 'react';
import { Form, Button,Toast,ToastContainer } from 'react-bootstrap';

const ClassModal = (onCreate) => {


    /*const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            //const type = parseInt(currentType , 10 );
            const indicators=[]; //=  currentIndicators.map((item, index) =>item!=undefined?{id:index}: null)
            for (var i=0; i < currentIndicators.length; i++) {
                if(currentIndicators[i]!=undefined && currentIndicators[i])
                {
                    indicators.push({id:i})
                }
            }

            console.log(
                {
                    task: {
                        id: null,
                        test: null,
                        typeTask: {id: type},
                        assessmentTask: 100,
                        explanation: currentText,
                        taskText: currentExplanation
                    },

                    responseOption: currentAnswers
                    ,
                    indicator: indicators
                }

            );
            const response = await fetch('http://localhost:8080/task/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                        task: {
                            id: null,
                            test: null,
                            typeTask: {id: type},
                            assessmentTask: 100,
                            explanation: currentText,
                            taskText: currentExplanation
                        },

                        responseOption: currentAnswers
                        ,
                        indicator: indicators
                    }
                )
            });
            let toastText;
            if (!response.ok) {
                toastText = "Ошибка создния задания";
                throw new Error();
            }
            toastText = "Задание создано";
            onCreate(toastText);
        } catch (error) {
            console.error('Ошибка отправки данных:', error);
        }
    }*/


    return (
        <div>
            <h1>Выберите классы</h1>
            <Form  /*onSubmit={handleSubmit}*/>

            </Form>
        </div>
    );
};

export default ClassModal;