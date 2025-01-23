import React, { useState, useEffect } from 'react';
import Navbar from "../Navbar";
import Theme from "../Theme";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";
import './styles.css'; // Импортируйте стили

const ThemePage = () => {
    const [subjectName, setSubjectName] = useState("Название предмета");
    const [themes, setThemes] = useState([]);
    const navigate = useNavigate();

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
                const response = await fetch('http://localhost:8080/subject/id:' + subid);
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
        async function fetchThemes() {
            try {
                const subid = getCookie("sub");
                const response = await fetch(`http://localhost:8080/theme/getbysubject:${subid}`);
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
                const themes = await response.json();
                console.log(themes)
                let count = 0;
                const array = []
                themes.forEach(subject => {
                    array.push(
                        <div key={count++} className="theme-container">
                            <h3>Доступные Вам темы:</h3>
                            <Theme id={subject.id} themeName={subject.themeName}/>
                        </div>
                    )
                });
                setThemes(array)

            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }
        fetchSubjectName();
        fetchThemes()
    }, []);

    return (
        <div className="page-container">
            <Navbar />
            <div className="content">
                <div className="Name">
                    <h1>{subjectName}</h1>
                </div>
                        {themes}
                </div>
                <Footer/>
            </div>
            );
            };

            export default ThemePage;
