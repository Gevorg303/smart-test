import React, {useEffect, useState} from 'react';
import Spinner from 'react-bootstrap/Spinner';

const DisplayClassCard = ({ objectItem }) => {
    const [loadSuccess, setLoadSuccess] = useState(false)
    const [display, setDisplay] = useState()
    useEffect(() => {
        try{
            if(objectItem.numberOfInstitution !== undefined && objectItem.letterDesignation !== undefined) {
                setDisplay(
                    <>
                        <h3>Класс №: {objectItem.id}</h3>
                        <p>Цифра: {objectItem.numberOfInstitution}</p>
                        <p>Буква: {objectItem.letterDesignation}</p>
                    </>
                )
                setLoadSuccess(true);
            }

        } catch (error) {
            setLoadSuccess(false);
        }

    }, [objectItem]);
    return (
        <>
        {loadSuccess ? display : <> <Spinner animation="border" variant="dark" /> </> }
        </>
    );
};

export default DisplayClassCard;
