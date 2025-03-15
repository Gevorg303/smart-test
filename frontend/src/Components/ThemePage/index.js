import React, { useState, useEffect } from 'react';
import Navbar from "../Navbar";
import Theme from "../Theme";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";
import './styles.css'; // Импортируйте стили
import { useOutletContext } from 'react-router-dom';

const ThemePage = () => {
    const [subjectName, setSubjectName] = useState("Название предмета");
    const [themes, setThemes] = useState([]);
    const navigate = useNavigate();
    const [topText, setTopText] = useOutletContext();
    localStorage.setItem('info', "Здесь содержатся темы по выбранному предмету, а также виды тестов по отдельной теме");

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
                if(!subid)
                {
                    navigate(-1,{replace:true})
                }
                const response = await fetch('http://localhost:8080/subject/find-subject-by-id',{
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
                setTopText(subject.subjectName);
            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }
        async function fetchThemes() {
            try {
                const subid = getCookie("sub");
                const response = await fetch(`http://localhost:8080/theme/get-by-subject`,{
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
                const themes = await response.json();
                console.log(themes)
                let count = 0;
                const array = []
                themes.forEach(subject => {
                    array.push(
                            <Theme key={subject.id} id={subject.id} themeName={subject.themeName}/>
                    )
                });
                setThemes(array)

            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }
        fetchSubjectName();
        fetchThemes()
    }, [setTopText]);

    return (

        <div className="page-container">
            <div className="content">
                {/*<div className="Name">
                    <h1>{subjectName}</h1>
                </div>*/}
                <div className="theme-container">
                    <h3>Доступные Вам темы:</h3>
                        {themes}
                </div>
                </div>
            {/*<Footer/>*/}
            </div>
            );
            };

            export default ThemePage;
