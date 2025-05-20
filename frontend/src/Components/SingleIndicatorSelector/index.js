import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import IndicatorSelector from "../IndicatorSelector";

const SingleIndicatorSelector = ({targetTheme,currentIndicator,setCurrentIndicator}) => {
    const [indicators,setIndicators] = useState([]);
    const [selected, setSelected] = useState();


    useEffect(() => {
        async function fetchQuestions() {

            try {
                if(targetTheme>0)
                {
                    const response = await fetch(process.env.REACT_APP_SERVER_URL+`indicator/indicator-by-theme`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify(
                            {
                                id: targetTheme
                            }
                        )
                    });
                    if (!response.ok) {
                        throw new Error('Ошибка получения тем');
                    }
                    const thjson = await response.json();
                    console.log(thjson)
                    setIndicators(thjson)
                }
                else
                {
                    setIndicators([])
                }


            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }
        console.log("prop changed: "+targetTheme)
        fetchQuestions();
    }, [targetTheme]);
    return (
        <>
            <Form.Group  className="mb-3" >
                <Form.Select value={currentIndicator}
                             onChange={(e) => {setSelected(e.target.value);setCurrentIndicator(e.target.value);}}>
                    <option value={-1}>Выберите индикатор</option>
                    {indicators.map((item, index)=><option key={item.id} value={item.id} > {item.nameOfTheIndicator}  </option>)}

                </Form.Select>
            </Form.Group>

        </>
    );
};

export default SingleIndicatorSelector;