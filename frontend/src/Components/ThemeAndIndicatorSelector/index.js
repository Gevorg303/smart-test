import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const ThemeAndIndicatorSelector = ({targetSubject,isTheme, indicators,setIndicators}) => {
    const [themes, setThemes] = useState([]);
    const [selected, setSelected] = useState();



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
                        if(isTheme) {
                            const response = await fetch(`http://localhost:8080/theme/getbysubject:${targetSubject}`);
                            if (!response.ok) {
                                throw new Error('Ошибка получения тем');
                            }
                            const thjson = await response.json();
                            console.log(thjson)
                            setThemes(thjson)
                        }
                        else
                        {
                            //Поменять запрос на запрос для индикаторов!!!
                            //
                            console.log("ts")
                            console.log(targetSubject)
                            const response = await fetch('http://localhost:8080/indicator/indicator-by-theme',{
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
                        }
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
                { isTheme ?  <Form.Select
                    onChange={(e) => {setSelected(e.target.value);}}>
                    {isTheme ? <option value={-1}>Выберите тему</option> : <option value={-1}></option>}
                    {isTheme ? themes.map((item, index)=><option key={item.id} value={item.id} > {item.themeName}  </option>):[]}

                </Form.Select> :
                <>
                    <h3>Индикаторы:</h3>
                    {targetSubject > 0 ?
                        themes.map((item, index) => <Form.Check // prettier-ignore
                                key={item.id}
                                type={'checkbox'}
                                id={item.id}
                                name="indicator"
                                label={item.nameOfTheIndicator}
                                onChange={() => {onClick(item.id)}}
                            />
                            /*<p key={item.id} value={item.id} > {item.nameOfTheIndicator}  </p>*/)
                        :
                        <h5> доступные индикаторы отсутсвуют</h5>
                    }
                </>
                }
            </Form.Group>

            {isTheme?<ThemeAndIndicatorSelector targetSubject={selected} indicators={indicators} setIndicators={setIndicators}/>:<></>}
        </>
    );
};

export default ThemeAndIndicatorSelector;