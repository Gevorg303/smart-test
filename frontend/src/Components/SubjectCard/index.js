import React from 'react';
import { Navigate } from "react-router-dom";

const SubjectCard = (props) => {


    const handleClick = (e) => {
        e.preventDefault();
        console.log(`You clicked ${props.id}`);
    };

    return (
        <div id={props.id} className="card" onClick={handleClick}>
            <h2>{props.name}</h2>
            <p>{props.description}</p>
        </div>
    );
};

export default SubjectCard;

