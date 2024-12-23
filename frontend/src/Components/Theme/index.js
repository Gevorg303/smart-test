import React, {useState,useEffect} from 'react';
import {Button} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const Theme = (props) => {


    const handleClick = (e,id) => {
        e.preventDefault();
        document.cookie = "test="+id+"; path=/;";
        navigate("/start-test")
    };
    const [tests, setTests] = useState([]);

    useEffect(() => {
        async function fetchTests() {
            try {
                document.cookie = "test=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
                const response = await fetch(`http://localhost:8080/theme/id:${props.id}`);
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
                const theme = await response.json();
                //console.log(theme)
                const response2 = await fetch('http://localhost:8080/test/get-test-id-theme', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify(theme)
                });
                if (!response2.ok) {
                    throw new Error("Ошибка получения вопросов");
                }
                const testsjson = await response2.json();
               // console.log(testsjson)
                const array =[]
                testsjson.forEach(test => {
                    array.push(
                        <Button key={test.id} onClick={(e,id)=> {
                            handleClick(e,test.id)}}>{test.typeTest.nameOfTestType}</Button>
                    )
                });
                setTests(array);

            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }
        fetchTests()
    }, []);

    let navigate = useNavigate();
    return (
        <div>
            <h2>{props.themeName}</h2>
            <h3>id: {props.id}</h3>
            {tests}

        </div>
    );
};

export default Theme;