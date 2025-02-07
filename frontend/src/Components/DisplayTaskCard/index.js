import React from 'react';

const DisplayTaskCard = (objectItem) => {
    return (
        <div>
            <h2>Задача №{objectItem.objectItem.id}</h2>
            <p>{objectItem.objectItem.taskText}</p>
        </div>
    );
};

export default DisplayTaskCard;