import React, { useState, useEffect, useRef } from 'react';
import SubjectCard from "../SubjectCard";
import WelcomeComponent from "../WelcomeComponent";
import "../Home/styles.css";
import Navbar from "../Navbar"; // Импортируем компонент Navbar

const HomePage = () => {
    const containerRef = useRef(null);
    let welcometext = "";
    let subjects = [];
    useEffect(() => {
        async function fetchUser() {
            try {
                document.cookie = "sub=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
                const response = await fetch('http://localhost:8080/users/current', {
                    credentials: "include",
                });
                if (!response.ok) {
                    // throw new Error('Ошибка сети');
                }
                const user = await response.json();
                console.log(user);
                welcometext = "Здравствуйте, " + user.name + " (" + user.role.role + ")";
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
    }, []);

    return (
        <div className="home-page">
            <Navbar />
            <WelcomeComponent text={welcometext} />
            <div className="container-wrapper">
                <div className="container" id="subjects-container" ref={containerRef}>
                    {}
                    <SubjectCard name='Химия' id='1' />
                    <SubjectCard name='Алгебра' id='2' description='description' />
                    <SubjectCard name='Русский язык' id='3' description='labore et dolore magna aliqua.'/>
                    <SubjectCard name='Геометрия' id='4' />
                    <SubjectCard name='География' id='5' />
                </div>
                <div className="button-container">
                    <button id="openModal" className="edit-button">Добавить / Удалить предмет</button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
