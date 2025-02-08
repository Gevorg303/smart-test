import React from 'react';

const DisplayTaskCard = (objectItem) => {
    return (
        <>
            <h2>Задача №{objectItem.objectItem.id}</h2>
            <p>{objectItem.objectItem.taskText}</p>
        </>
    );
};

export default DisplayTaskCard;