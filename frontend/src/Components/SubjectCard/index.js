import React from 'react';
import { useNavigate } from "react-router-dom";
import './styles.css';

const SubjectCard = (props) => {

    let navigate = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();
        console.log(`You clicked ${props.id}`);
       // navigate(`/theme/${props.id}`);
        document.cookie = "sub="+props.id+"; path=/;";
        navigate("/theme");
    };

    return (
        <div id={props.id} className="card" onClick={handleClick}>
            <h2>{props.name}</h2>
            <p>{props.description}</p>
        </div>
    );
};

export default SubjectCard;

