import React from 'react';
import {Button} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const Theme = (props) => {

    const handleClick = (e) => {
        e.preventDefault();
        document.cookie = "test="+props.id+"; path=/;";
        navigate("/start-test")
    };

    let navigate = useNavigate();
    return (
        <div>
            <h2>{props.themeName}</h2>
            <h3>id: {props.id}</h3>
            <Button onClick={handleClick}>Входной тест</Button>
            <Button  onClick={handleClick}>Тренажер</Button>
            <Button  onClick={handleClick}>Итоговый тест</Button>
        </div>
    );
};

export default Theme;