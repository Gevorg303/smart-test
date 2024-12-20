import React from 'react';
import { useNavigate } from "react-router-dom";

const SubjectCard = (props) => {

    let navigate = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();
        console.log(`You clicked ${props.id}`);
        navigate(`/theme/${props.id}`);
    };

    return (
        <div id={props.id} className="card" onClick={handleClick}>
            <h2>{props.name}</h2>
            <p>{props.description}</p>
        </div>
    );
};

export default SubjectCard;

