import React from 'react';

const DisplayThemeCard = (objectItem) => {
    return (
        <>
            <h2>Тема №{objectItem.objectItem.id}</h2>
            <p> Имя темы: {objectItem.objectItem.themeName}</p>
        </>
    );
};
export default DisplayThemeCard;