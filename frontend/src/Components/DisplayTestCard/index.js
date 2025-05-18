import React, {useEffect, useState} from 'react';
import Spinner from 'react-bootstrap/Spinner';

const DisplayTestCard = (objectItem) => {
    const [loadSuccess, setLoadSuccess] = useState(false)
    const [display, setDisplay] = useState()
    useEffect(() => {
        try{
            setDisplay(
                <>
                    <p>Тест №{objectItem.objectItem.id}</p>
                    <h2>{objectItem.objectItem.theme.subject.subjectName} > {objectItem.objectItem.theme.themeName}: {objectItem.objectItem.typeTest.nameOfTestType}</h2>
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

export default DisplayTestCard;