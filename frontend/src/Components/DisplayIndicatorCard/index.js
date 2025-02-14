import React from 'react';

const DisplayIndicatorCard = (objectItem) => {
    return (
        <>
            <h2>Индикатор №{objectItem.objectItem.id}</h2>
            <p> Имя индикатора: {objectItem.objectItem.nameOfTheIndicator}</p>
            <p> Тема индикатора: {objectItem.objectItem.theme.themeName}</p>
        </>
    );
};
export default DisplayIndicatorCard;