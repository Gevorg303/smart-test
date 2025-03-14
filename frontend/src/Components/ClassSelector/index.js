import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const ClassSelector = ({targetSubject, classes,setClasses}) => {
    const [themes, setThemes] = useState([]);
    const [ids, setIds] = useState([]);

    const onClick = async (id) => {
        const newIds = [...ids];
        const currentState = newIds[id];

        if (currentState) {
            console.log("delete");
            // Здесь можно добавить логику для удаления, если нужно
        } else {
            console.log("add");
            try {
                const subjectDto = {
                    id: targetSubject.id,
                    name: targetSubject.name,
                    // Добавьте другие поля, если они есть в SubjectDto
                };

                const studentClassDto = {
                    id: id,
                    numberOfInstitution: themes.find(item => item.id === id).numberOfInstitution,
                    letterDesignation: themes.find(item => item.id === id).letterDesignation,
                    // Добавьте другие поля, если они есть в StudentClassDto
                };

                const response = await fetch('http://localhost:8080/user-subject/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify({
                        subject: subjectDto,
                        studentClass: studentClassDto
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Ошибка при подписании класса на предмет: ${errorText}`);
                }

                const result = await response.text();
                console.log(result);
            } catch (error) {
                console.error('Ошибка:', error);
            }
        }

        newIds[id] = !currentState;
        setIds(newIds);

        const newClasses = [...classes];
        newClasses[id] = newIds[id];
        setClasses(newClasses);

        console.log(newIds);
        console.log(newClasses);
    };



    useEffect(() => {
        async function fetchQuestions() {
            try {
                if(targetSubject!=null) {

                    if(classes!=null)
                    {
                    const array = []
                    classes.map((item, index) => array[item.id] = true)
                    setIds(array)
                    console.log(array)
                    }
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
    }, [targetSubject,classes]);
    return (
        <>
            <h3>Классы:</h3>
            {targetSubject != null ?
                themes.map((item, index) => <Form.Check // prettier-ignore
                        key={item.id}
                        type={'checkbox'}
                        checked={ids[item.id] || false}
                        id={item.id}
                        name="class"
                        label={item.numberOfInstitution + item.letterDesignation}
                        onChange={() => onClick(item.id)}
                    />
                    /*<p key={item.id} value={item.id} > {item.nameOfTheClass}  </p>*/)
                :
                <h5> доступные классы отсутствуют</h5>
            }
        </>
    );
};

export default ClassSelector;