import React, {useEffect, useState} from 'react';
import Spinner from 'react-bootstrap/Spinner';

const DisplayStudentCard = ({ objectItem }) => {
    const [loadSuccess, setLoadSuccess] = useState(false)
    const [display, setDisplay] = useState()
    useEffect(() => {
        try{
            if(objectItem.surname !== undefined && objectItem.patronymic !== undefined) {
                setDisplay(
                    <>
                        <h3>Пользователь №: {objectItem.id}</h3>
                        <p>Имя: {objectItem.name}</p>
                        <p>Фамилия: {objectItem.surname}</p>
                        <p>Отчество: {objectItem.patronymic}</p>
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

export default DisplayStudentCard;
