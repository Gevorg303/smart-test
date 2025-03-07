import React, {useEffect, useState} from 'react';
import './styles.css';
import {Button} from "react-bootstrap";
import EditImage from '../../images/pencil.png';


const SubjectCardForClass = ({item,setShowCreateModal, setCurrentSubject}) => {

    const [classes, setClasses] = useState();

    /*useEffect(() => {
        async function fetchClasses() {
            const response = await fetch('http://localhost:8080/subject/print-user-subject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify("")
            });
            if (!response.ok) {
                throw new Error('Ошибка вывода предметов учителя');
            }
            const subjectsJson = await response.json();
            const array = [];
            subjectsJson.forEach(subject => {
                array.push(

                );
            });
            setClasses(array);
        }

    }, []);*/


    return (
        <div>
            <Button className="component-button">
                <div id={item.id} className="card-subject-class">
                    {/*<h2>{item.id}</h2>*/}
                    <h2>{item.subjectName}</h2>
                    <Button variant="success" className="custom-button" onClick={() => {
                        setShowCreateModal(true)
                        setCurrentSubject(item)
                        console.log(item)
                    }}>
                        <img src={EditImage} alt="Icon" className="button-icon"/>
                    </Button>
                </div>
            </Button>
        </div>
    )
        ;
};

export default SubjectCardForClass;