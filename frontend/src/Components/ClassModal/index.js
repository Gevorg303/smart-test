import React, {useState} from 'react';
import { Form, Button,Toast,ToastContainer } from 'react-bootstrap';
import ClassSelector from "../ClassSelector";

const ClassModal = ({targetSubject}) => {
    const [classes, setClasses] = useState([]);


    return (
        <div>
            <h1>Выберите классы</h1>
            <Form  /*onSubmit={handleSubmit}*/>
                <ClassSelector targetSubject = {targetSubject} indicators={classes} setIndicators={setClasses}/>
            </Form>
        </div>
    );
};

export default ClassModal;