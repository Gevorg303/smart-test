import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const ClassSelector = ({targetSubject, classes,setClasses}) => {
    const [themes, setThemes] = useState([]);

    const onClick = (id) => {
        const array = [...classes];
        array[id] = !array[id]?true:false;
        setClasses(array);
        console.log(array)
    };
    useEffect(() => {
        async function fetchQuestions() {

            try {
                if(targetSubject!=null)
                {
                    const response1 = await fetch('http://localhost:8080/users/current', { //получить пользователя
                        credentials: "include",
                    });
                    if (!response1.ok) {
                        throw new Error('Ошибка сети');
                    }
                    const user = await response1.json();

                    console.log(user)

                    const response = await fetch('http://localhost:8080/users/find-student-class-by-user',{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify(user)});
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