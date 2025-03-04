import React, {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import './styles.css';
import Full_logo from "../../images/Full_logo.png";
import {Button} from "react-bootstrap";
import CreateTestPage from "../CreateTestPage";
import CreateQuestionPage from "../CreateQuestionPage";
import CreateSubjectPage from "../CreateSubjectPage";
import CreateThemePage from "../CreateThemePage";
import CreateIndicatorPage from "../CreateIndicatorPage";

import ClassModal from "../ClassModal";
import Theme from "../Theme";

const SubjectCardForClass = (props) => {

    const [editItem, setEditItem] = useState(null); // объект который изменяется
    //const [showEditModal, setShowEditModal] = useState(false); // переменная для отображение модального окна создания когда происходит редактирование
    const [showCreateModal, setShowCreateModal] = useState(false); // переменная отвенчает за отображение модального окна на экране
    const [showToast, setShowToast] = useState(false); // отображение тоста
    const [toastText, setToastText] = useState(""); // текст тоста
    const [createModal, setCreateModal] = useState(); // компонент с модальным окном для создания объекта в банке
    const [classes, setClasses] = useState([]);
    const navigate = useNavigate();
    const [subjectName, setSubjectName] = useState("Название предмета");

    /*function EditFunc(item) { //открывает модальное окно для редактирования объекта
        setEditItem(item)
        setShowEditModal(true)
    }*/
    const handleCreate = (message) => {
        setShowCreateModal(false);
        setShowToast(true);
        setToastText(message);
    };


    useEffect(() => {
        function getCookie(name) {
            let matches = document.cookie.match(new RegExp(
                "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ));
            return matches ? decodeURIComponent(matches[1]) : undefined;
        }

        async function fetchSubjectName() {
            try {
                const subid = getCookie("sub");
                if (!subid) {
                    navigate(-1, {replace: true})
                }
                const response = await fetch('http://localhost:8080/subject/find-subject-by-id', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify(
                        {
                            id: subid
                        }
                    )
                });
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
                const subject = await response.json();
                console.log(subject)
                setSubjectName(subject.subjectName);

            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }

        async function fetchClasses() {
            try {
                const subid = getCookie("sub");
                const response = await fetch(`http://localhost:8080/???`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify(
                        {
                            id: subid
                        }
                    )
                });
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
                const classes = await response.json();
                console.log(classes)
                let count = 0;
                const array = []
                classes.forEach(subject => {
                    array.push(

                    )
                });
                setClasses(array)
                setCreateModal(<ClassModal onCreate={handleCreate}/>); // задать модальное окно для создания на странице

            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }

        fetchSubjectName();
        fetchClasses()
    }, []);

    /* className="page-container-quest"*/

    //let navigate = useNavigate();

    /*const handleClick = (e) => {
        e.preventDefault();
        console.log(`You clicked ${props.id}`);
        // navigate(`/theme/${props.id}`);
        document.cookie = "sub="+props.id+"; path=/;";
        navigate("/theme");
    };*/

    return (
        <div>
            <Button className="component-button">
        <div id={props.id} className="card-subject-class">
            <h2>{props.name}</h2>

            <Button variant="success" className="custom-button" onClick={() => {
                setShowCreateModal(true)
            }}>Нажми меня</Button>
        </div>
            </Button>
        </div>
    );
};

export default SubjectCardForClass;