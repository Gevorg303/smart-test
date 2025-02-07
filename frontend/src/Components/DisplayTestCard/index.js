import React from 'react';

const DisplayTestCard = (objectItem) => {
    return (
        <>
            <p>Тест №{objectItem.objectItem.id}</p>
            <h2>{objectItem.objectItem.theme.subject.subjectName} > {objectItem.objectItem.theme.themeName}: {objectItem.objectItem.typeTest.nameOfTestType}</h2>
            <p>{objectItem.objectItem.description}</p>
        </>
    );
};

export default DisplayTestCard;