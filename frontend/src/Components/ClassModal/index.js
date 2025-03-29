import React, {useState} from 'react';
import { Form, Button,Toast,ToastContainer } from 'react-bootstrap';
import ClassSelector from "../ClassSelector";

const ClassModal = ({targetSubject, /*classes, setClasses*/}) => {
    //const [classes, setClasses] = useState([]);//classes, setClasses


    return (
        <div>
            <h1>Выберите классы</h1>
            <Form  /*onSubmit={handleSubmit}*/>
                <ClassSelector targetSubject = {targetSubject} /*classes={classes} setClasses={setClasses}*//>

            </Form>
        </div>
    );
};

export default ClassModal;