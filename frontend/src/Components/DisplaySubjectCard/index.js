import React, {useEffect, useState} from 'react';
import Spinner from 'react-bootstrap/Spinner';

const DisplaySubjectCard = (objectItem) => {
    const [loadSuccess, setLoadSuccess] = useState(false)
    const [display, setDisplay] = useState()
    useEffect(() => {
        try{
            setDisplay(
                <>
                    <h2>Предмет №{objectItem.objectItem.id}</h2>
                    <h3>{objectItem.objectItem.subjectName} {/*objectItem.objectItem.teacherClass.studentClass.numberOfInstitution}{objectItem.objectItem.teacherClass.studentClass.letterDesignation*/}</h3>
                    <p>{objectItem.objectItem.description}</p>
                </>
            )
            setLoadSuccess(true);
        }catch (error){
            setLoadSuccess(false);
        }

    }, [objectItem]);
    return (
        <>
            {loadSuccess ? display : <> <Spinner animation="border" variant="dark" /> </> }
        </>
    );
};

export default DisplaySubjectCard;