import React from 'react';
import {Button} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const Theme = (props) => {

    let navigate = useNavigate();
    return (
        <div>
            <h2>{props.themeName}</h2>
            <Button onClick={()=>{
                navigate("/start-test")

            }}>Входной тест</Button>
            <Button onClick={()=>{
                navigate("/start-test")

            }}>Тренажер</Button>
            <Button onClick={()=>{
                navigate("/start-test")

            }}>Итоговый тест</Button>
        </div>
    );
};

export default Theme;