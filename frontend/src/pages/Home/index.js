import React, { useState, useEffect, useRef } from 'react';
import SubjectCard from "../../Components/TestingModule/SubjectCard";
import "./styles.css";
import { useOutletContext } from 'react-router-dom';

const HomePage = () => {
    const containerRef = useRef(null);
    const containerRef2 = useRef(null);
    const [subjects, setSubjects] = useState([]);
    const [topText, setTopText] = useOutletContext();

    localStorage.setItem('info', "Здесь находятся Ваши предметы.");

    useEffect(() => {
        async function fetchUser() {
            try {
                document.cookie = "sub=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                document.cookie = "test=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                const response = await fetch(process.env.REACT_APP_SERVER_URL + 'users/current', {
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
                const user = await response.json();
                setTopText("Здравствуйте, " + user.name + " (" + user.role.role + ")");

                const container = document.querySelector('.all-container');
                if (container) {
                    container.classList.add('page-style-1');
                }

                const response2 = await fetch(process.env.REACT_APP_SERVER_URL + 'subject/print-user-subject', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify(user)
                });
                if (!response2.ok) {
                    throw new Error('Ошибка вывода предметов учителя');
                }
                const subjectsJson = await response2.json();
                const array = subjectsJson.map(subject => (
                    <SubjectCard key={subject.id} id={subject.id} name={subject.subjectName} description={subject.description} />
                ));
                setSubjects(array);
            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }

        fetchUser();

        // Очистка topText при размонтировании компонента
        return () => {
            setTopText("");
        };
    }, [setTopText]);

    return (
        <div className="home-page" ref={containerRef2}>
            <div className="container-wrapper">
                <div className="container-home" id="subjects-container" ref={containerRef} data-count={subjects.length}>
                    {subjects.length > 0 ? subjects : <p className="no-subjects-message">У Вас нет доступных предметов</p>}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
