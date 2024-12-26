import React, { useState, useEffect, useRef } from 'react';
import SubjectCard from "../SubjectCard";
import WelcomeComponent from "../WelcomeComponent";
import "../Home/styles.css";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { Button } from 'react-bootstrap';

const HomePage = () => {
    const containerRef = useRef(null);
    const [welcometext, setwelcometext] = useState("");
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        async function fetchUser() {
            try {
                document.cookie = "sub=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
                document.cookie = "test=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
                const response = await fetch('http://localhost:8080/users/current', {
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
                const user = await response.json();
                console.log(user);
                setwelcometext("Здравствуйте, " + user.name + " (" + user.role.role + ")");
                const response2 = await fetch('http://localhost:8080/subject/' + user.login);
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
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        const cards = container.querySelectorAll('.card');
        let maxWidth = 0;
        let maxHeight = 0;

        cards.forEach(card => {
            const width = card.offsetWidth;
            const height = card.offsetHeight;
            if (width > maxWidth) {
                maxWidth = width;
            }
            if (height > maxHeight) {
                maxHeight = height;
            }
        });

        cards.forEach(card => {
            card.style.width = `${maxWidth}px`;
            card.style.height = `${maxHeight}px`;
        });
    }, [subjects]);

    return (
        <>
            <Navbar />
            <div className="home-page">
                <div className="welcome">
                    <WelcomeComponent text={welcometext}/>
                </div>
                <div className="container-wrapper">
                    <div className="container-home" id="subjects-container" ref={containerRef}>
                        {subjects}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default HomePage;
