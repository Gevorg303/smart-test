import React from 'react';

const DisplaySubjectCard = (objectItem) => {
    return (
        <>
            <h2>Предмет №{objectItem.objectItem.id}</h2>
            <h3>{objectItem.objectItem.subjectName} {objectItem.objectItem.teacherClass.studentClass.numberOfInstitution}{objectItem.objectItem.teacherClass.studentClass.letterDesignation}</h3>
            <p>{objectItem.objectItem.description}</p>
        </>
    );
};

export default DisplaySubjectCard;