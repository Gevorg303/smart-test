import React from 'react';

const DisplayClassCard = ({ objectItem }) => {
    return (
        <div>
            <h3>Класс №: {objectItem.id}</h3>
            <p>Цифра: {objectItem.numberOfInstitution}</p>
            <p>Буква: {objectItem.letterDesignation}</p>
        </div>
    );
};

export default DisplayClassCard;
