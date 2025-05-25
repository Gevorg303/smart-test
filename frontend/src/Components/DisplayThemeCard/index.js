import React, {useEffect, useState} from 'react';
import Spinner from 'react-bootstrap/Spinner';

const DisplayThemeCard = (objectItem) => {
    const [loadSuccess, setLoadSuccess] = useState(false)
    const [display, setDisplay] = useState()
    useEffect(() => {
        try{
            if(objectItem.objectItem.themeName !== undefined){
                setDisplay(
                    <>
                        <h2>Тема №{objectItem.objectItem.id}</h2>
                        <p> Имя темы: {objectItem.objectItem.themeName}</p>
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
export default DisplayThemeCard;