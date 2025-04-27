import React from 'react';

const DisplayStudentCard = ({ objectItem }) => {
    return (
        <div>
            <h3>Пользователь №: {objectItem.id}</h3>
            <p>Имя: {objectItem.name}</p>
            <p>Фамилия: {objectItem.surname}</p>
            <p>Отчество: {objectItem.patronymic}</p>
        </div>
    );
};

export default DisplayStudentCard;
