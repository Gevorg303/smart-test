import React, {useEffect, useState} from 'react';
import {Form, Button, Toast, ToastContainer} from 'react-bootstrap';
import ClassSelector from "../ClassSelector";

const ClassModal = ({targetSubject, showModal, onCreate/*classes, setClasses*/}) => {
    //const [classes, setClasses] = useState([]);//classes, setClasses
    const [classes, setClasses] = useState([]);
    const [originalClasses, setOriginalClasses] = useState([]);
    useEffect(() => {
        if (!showModal) {
            setClasses([]);
            setOriginalClasses([]);
            console.log("clear")
        }
    }, [showModal]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(classes);
        console.log(originalClasses);
        const subjectDto = {
            id: targetSubject.id,
            name: targetSubject.name,
        };
        const deletedClasses = [];
        const addedClasses = [];
        classes.map((item, index) => {
            if (classes[index].status !== originalClasses[index].status) {
                if (classes[index].status) {
                    addedClasses.push(item.studentClassDto);
                } else {
                    deletedClasses.push(item.studentClassDto);
                }
            }
        })
        console.log("delete");
        try {

            const response = await fetch('http://localhost:8080/user-subject/remove', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    subject: subjectDto,
                    studentClassDtoList: deletedClasses
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

        console.log("add");
        try {

            const response = await fetch('http://localhost:8080/user-subject/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    subject: subjectDto,
                    studentClassDtoList: addedClasses
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
        onCreate("Успех");
    };
    useEffect(() => {
        async function fetchQuestions() {
            try {
                if (targetSubject != null) {

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
                    //setClasses(subjectsJson)
                    if (subjectsJson != null) {
                        /*const array = []
                        subjectsJson.map((item, index) => array[item.id] = true)
                        setIds(array)
                        console.log(array)*/
                        setClasses(subjectsJson);
                        //setOriginalClasses(subjectsJson);
                        subjectsJson.map((item, index) => {
                            originalClasses.push({
                                studentClassDto : item.studentClassDto ,
                                status : item.status
                            });
                        })

                    }
                } else {
                    setClasses([]);
                    setOriginalClasses([]);
                }
            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }

        //console.log("prop changed: "+targetSubject.id)
        fetchQuestions();
    }, [targetSubject]);

    return (
        <div>
            <h1>Выберите классы</h1>
            <Form onSubmit={handleSubmit}>
                <ClassSelector targetSubject={targetSubject} classes={classes} setClasses={setClasses}/>
                <Button variant="primary" type="submit">
                    {"Подтвердить"}
                </Button>
            </Form>
        </div>
    );
};

export default ClassModal;