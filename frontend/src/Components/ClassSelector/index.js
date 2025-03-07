import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const ClassSelector = ({targetSubject, indicators,setIndicators}) => {
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
                if(targetSubject!=null)
                {

                    //

                    const response = await fetch('http://localhost:8080/user-subject/find-class-by-subject',{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify({id:targetSubject.id})});
                    if (!response.ok) {
                        throw new Error('Ошибка получения классов ');
                    }
                    const thjson = await response.json();
                    console.log(thjson)
                    setThemes(thjson)

                }
                else
                {
                }


            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }
        //console.log("prop changed: "+targetSubject.id)
        fetchQuestions();
    }, [targetSubject]);
    return (
        <>
            <h3>Классы:</h3>
            {targetSubject != null ?
                themes.map((item, index) => <Form.Check // prettier-ignore
                        key={item.id}
                        type={'checkbox'}
                        id={item.id}
                        name="indicator"
                        label={item.numberOfInstitution + item.letterDesignation}
                        onChange={() => {onClick(item.id)}}
                    />
                    /*<p key={item.id} value={item.id} > {item.nameOfTheIndicator}  </p>*/)
                :
                <h5> доступные классы отсутсвуют</h5>
            }
        </>
    );
};

export default ClassSelector;