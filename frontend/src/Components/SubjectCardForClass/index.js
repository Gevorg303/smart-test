import React, {useEffect, useState} from 'react';
import './styles.css';
import {Button} from "react-bootstrap";
import EditImage from '../../images/pencil.png';
import { Accordion } from 'react-bootstrap';


const SubjectCardForClass = ({item,setShowCreateModal, setCurrentSubject, showModal/*, setCurrentClasses*/}) => {

    const [classes, setClasses] = useState();

    useEffect(() => {
        async function fetchClasses() {
          //  if (!showModal) {
                console.log(item)
                const response = await fetch(process.env.REACT_APP_SERVER_URL+'user-subject/find-class-by-subject', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify(item)
                });
                if (!response.ok) {
                    throw new Error('Ошибка вывода предметов учителя');
                }
                const subjectsJson = await response.json();
                console.log(subjectsJson)
                //setCurrentClasses(subjectsJson)
                const array = [];
                subjectsJson.forEach(subject => {
                    //if (subject.status)
                    array.push(subject.status ?
                        <p> {subject.studentClassDto.numberOfInstitution + subject.studentClassDto.letterDesignation}</p> :
                        <></>
                    );
                });
                setClasses(array);
           // }
        }
        fetchClasses();
    }, [showModal]);


    return (
        <div>
            <div className="accordion-classes">
                <Accordion defaultActiveKey="1">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            <h2>{item.subjectName}</h2>
                            <Button
                                variant="success"
                                className="custom-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowCreateModal(true);
                                    setCurrentSubject(item);
                                    console.log(item);
                                }}
                            >
                                <img src={EditImage} alt="Icon" className="button-icon" />
                            </Button>
                        </Accordion.Header>
                        <Accordion.Body>
                            <div className="buttons-container-classes">
                                {classes}
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>

                </Accordion>
            </div>
        </div>
    );
};

export default SubjectCardForClass;