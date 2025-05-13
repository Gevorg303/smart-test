import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const IndicatorSelector = ({targetSubject, indicators,setIndicators}) => {
    const [themes, setThemes] = useState([]);



    const onClick = (id) => {
        const array = [...indicators];
        array[id] = !array[id]?true:false;
        setIndicators(array);
        console.log(array)
    };
    useEffect(() => {
        async function fetchQuestions() {
            try {
                if(targetSubject>0)
                {

                        //Поменять запрос на запрос для индикаторов!!!
                        //
                        console.log("ts")
                        console.log(targetSubject)
                        const response = await fetch('http://localhost:8081/indicator/indicator-by-theme',{
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json;charset=UTF-8'
                            },
                            body: JSON.stringify({id:targetSubject})});
                        if (!response.ok) {
                            throw new Error('Ошибка получения индикаторов ');
                        }
                        const thjson = await response.json();
                        console.log(thjson)
                        setThemes(thjson)
                        if(indicators != undefined || indicators.length > 0){
                            console.log(indicators)
                        }

                }



            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }
        console.log("indicators: prop changed: "+targetSubject)
        fetchQuestions();
    }, [targetSubject,indicators]);
    return (
        <>
            <h3>Индикаторы:</h3>
            {targetSubject > 0 ?
                themes.map((item, index) => <Form.Check // prettier-ignore
                        key={item.id}
                        type={'checkbox'}
                        id={item.id}
                        name="indicator"
                        checked={indicators[item.id]===true?true:false}
                        label={item.nameOfTheIndicator}
                        onChange={() => {onClick(item.id)}}
                    />
                    /*<p key={item.id} value={item.id} > {item.nameOfTheIndicator}  </p>*/)
                :
                <h5> доступные индикаторы отсутсвуют</h5>
            }
        </>
    );
};

export default IndicatorSelector;