import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import IndicatorSelector from "../IndicatorSelector";

const ThemeAndIndicatorSelector = ({targetSubject, needIndicators, indicators,setIndicators,currentTheme,setCurrentTheme}) => {
    const [themes, setThemes] = useState([]);
    const [selected, setSelected] = useState();


    useEffect(() => {
        async function fetchQuestions() {

                try {
                    if(targetSubject>0)
                    {

                            const response = await fetch(`http://localhost:8080/theme/get-by-subject`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json;charset=UTF-8'
                                },
                                body: JSON.stringify(
                                    {
                                        id: targetSubject
                                    }
                                )
                            });
                            if (!response.ok) {
                                throw new Error('Ошибка получения тем');
                            }
                            const thjson = await response.json();
                            console.log(thjson)
                            setThemes(thjson)
                    }
                    else
                    {
                        setThemes([])
                    }


                } catch (error) {
                    console.error('Ошибка получения данных:', error);
                }
        }
        console.log("prop changed: "+targetSubject)
        fetchQuestions();
    }, [targetSubject]);
    return (
        <>
            <Form.Group  className="mb-3" >
                 <Form.Select value={currentTheme}
                    onChange={(e) => {setSelected(e.target.value);setCurrentTheme(e.target.value);}}>
                     <option value={-1}>Выберите тему</option>
                    {themes.map((item, index)=><option key={item.id} value={item.id} > {item.themeName}  </option>)}

                </Form.Select>
            </Form.Group>

            {needIndicators?<IndicatorSelector targetSubject={selected} indicators={indicators} setIndicators={setIndicators}/>:<></>}
        </>
    );
};

export default ThemeAndIndicatorSelector;