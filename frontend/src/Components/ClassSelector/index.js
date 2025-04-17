import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const ClassSelector = ({targetSubject, /*classes,setClasses*/}) => {
    const [themes, setThemes] = useState([]); //все классы
    const [ids, setIds] = useState([]); // связанные классы
    let flag = false;

    const onClick = async (id, value) => {
        const newIds = [...ids];
        const currentState = newIds[id];


        if (!value) {
            console.log("delete");
            try {
                const subjectDto = {
                    id: targetSubject.id,
                    name: targetSubject.name,
                };

                const themesFind = themes.find(item => item.id === id);
                let studentClassDto;
                if (themesFind != undefined)
                {
                    studentClassDto = {
                        id: id,
                        numberOfInstitution: themes.find(item => item.id === id).numberOfInstitution,
                        letterDesignation: themes.find(item => item.id === id).letterDesignation,
                    };}

                const response = await fetch('http://localhost:8080/user-subject/remove', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify({
                        subject: subjectDto,
                        studentClassDtoList: [studentClassDto]
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
        } else {
            console.log("add");
            try {
                const subjectDto = {
                    id: targetSubject.id,
                    name: targetSubject.name,
                };
                const themesFind = themes.find(item => item.id === id);
                let studentClassDto;
                if (themesFind != undefined)
                {
                    studentClassDto = {
                    id: id,
                    numberOfInstitution: themes.find(item => item.id === id).numberOfInstitution,
                    letterDesignation: themes.find(item => item.id === id).letterDesignation,
                };}

                const response = await fetch('http://localhost:8080/user-subject/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify({
                        subject: subjectDto,
                        studentClassDtoList: [studentClassDto]
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
        flag = !flag;
        setIds(newIds);

        /*  const newClasses = [...classes];
          newClasses[id] = newIds[id];
          setClasses(newClasses);*/

        console.log(newIds);
        // console.log(newClasses);
    };


    useEffect(() => {
        async function fetchQuestions() {
            try {
                if(targetSubject!=null) {

                    const response = await fetch('http://localhost:8080/user-subject/find-class-by-subject', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify(targetSubject)
                    });
                    if (!response.ok) {
                        throw new Error('Ошибка вывода предметов учителя');
                    }
                    const subjectsJson = await response.json();
                    console.log(subjectsJson)
                    //setThemes(subjectsJson)
                    if(subjectsJson!=null)
                    {
                        /*const array = []
                        subjectsJson.map((item, index) => array[item.id] = true)
                        setIds(array)
                        console.log(array)*/
                        setThemes(subjectsJson);
                    }
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
    }, [targetSubject, flag]);
    /*useEffect(() => {
        async function fetchQuestions() {
            try {
                if(targetSubject!=null) {

                    /*
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
    }, [targetSubject,ids]);*/
    return (
        <>
            <h3>Классы:</h3>
            {targetSubject != null ?
                themes.map((item, index) => <Form.Check // prettier-ignore
                        key={item.studentClassDto.id}
                        type={'checkbox'}
                        checked={item.status}
                        id={item.studentClassDto.id}
                        name="class"
                        label={item.studentClassDto.numberOfInstitution + item.studentClassDto.letterDesignation}
                        onChange={(e) => onClick(item.studentClassDto.id, e.target.value)}
                    />
                    /*<p key={item.id} value={item.id} > {item.nameOfTheClass}  </p>*/)
                :
                <h5> доступные классы отсутствуют</h5>
            }
        </>
    );
};

export default ClassSelector;