import React, {useEffect, useState} from 'react';
import Spinner from 'react-bootstrap/Spinner';

const DisplayTaskCard = (objectItem) => {
    const [loadSuccess, setLoadSuccess] = useState(false)
    const [display, setDisplay] = useState()
    useEffect(() => {
        try{
            if(objectItem.objectItem.taskText !== undefined){
                setDisplay(
                    <>
                        <h2>Задача №{objectItem.objectItem.id}</h2>
                        <p>{objectItem.objectItem.taskText}</p>
                    </>
                )
                setLoadSuccess(true);
            }
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

export default DisplayTaskCard;