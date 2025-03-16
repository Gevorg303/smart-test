import React, { useState, useEffect, useRef } from 'react';
import SubjectCard from "../SubjectCard";
import WelcomeComponent from "../WelcomeComponent";
import "../Home/styles.css";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { Button } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';

const HomePage = () => {
    const containerRef = useRef(null);
    const [welcometext, setwelcometext] = useState("");
    const [subjects, setSubjects] = useState([]);
    const [topText, setTopText] = useOutletContext();

    localStorage.setItem('info', "Здесь находятся ваши предметы");

    useEffect(() => {
        async function fetchUser() {
            try {

                //localStorage.setItem('info', "111");
                document.cookie = "sub=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                document.cookie = "test=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                const response = await fetch('http://localhost:8080/users/current', {
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
                const user = await response.json();
                console.log(user);
                setTopText("Здравствуйте, " + user.name + " (" + user.role.role + ")");
                //setwelcometext("Здравствуйте, " + user.name + " (" + user.role.role + ")");
                const response2 = await fetch('http://localhost:8080/subject/print-user-subject', {
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
                const array = [];
                subjectsJson.forEach(subject => {
                    array.push(
                        <SubjectCard key={subject.id} id={subject.id} name={subject.subjectName} description={subject.description} />
                    );
                });
                setSubjects(array);
            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }
        fetchUser();
    }, [setTopText]);

    return (
        <>
            <div className="home-page">
                <div className="welcome">
                    {/*<WelcomeComponent text={welcometext} />*/}
                </div>
                <div className="container-wrapper">
                    <div className="container-home" id="subjects-container" ref={containerRef} data-count={subjects.length}>
                        {subjects}
                    </div>
                </div>
            </div>

        </>
    );
};

export default HomePage;
