import React, {useEffect, useState} from 'react';
import Spinner from 'react-bootstrap/Spinner';

const DisplayIndicatorCard = (objectItem) => {
    const [loadSuccess, setLoadSuccess] = useState(false)
    const [display, setDisplay] = useState()
    useEffect(() => {
        try{
            if(objectItem.objectItem.nameOfTheIndicator !== undefined && objectItem.objectItem.theme !== undefined) {
                setDisplay(
                    <>
                        <h2>Индикатор №{objectItem.objectItem.id}</h2>
                        <p> Имя индикатора: {objectItem.objectItem.nameOfTheIndicator}</p>
                        <p> Тема индикатора: {objectItem.objectItem.theme.themeName}</p>
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
export default DisplayIndicatorCard;