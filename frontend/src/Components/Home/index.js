import React, { useState, useEffect, useRef } from 'react';
import SubjectCard from "../SubjectCard";
import WelcomeComponent from "../WelcomeComponent";
import "../Home/styles.css";
import Navbar from "../Navbar";
import {Button} from 'react-bootstrap';



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
                    // throw new Error('Ошибка сети');
                }
                const user = await response.json();
                console.log(user);
                setwelcometext("Здравствуйте, " + user.name + " (" + user.role.role + ")");
                const response2 = await fetch('http://localhost:8080/subject/'+user.login);
                if (!response2.ok) {
                    throw new Error('Ошибка вывода предметов учителя');
                }
                const subjectsJson = await response2.json();
                let count = 0;
                const array =[]
                subjectsJson.forEach(subject => {
                    // console.log(subject.numberOfInstitution +" "+ subject.letterDesignation +" "+ subject.educationalInstitution.nameOfTheInstitution + " "+ subject.educationalInstitution.address)
                    // select.append(new Option(subject.numberOfInstitution +" "+ subject.letterDesignation +" "+ subject.educationalInstitution.nameOfTheInstitution + " "+ subject.educationalInstitution.address,subject.id))
                  //  const array = [...subjects]
                    array.push(
                        <SubjectCard key={count++} id={subject.id} name={subject.subjectName} description={subject.description} />
                    )
                 //   setSubjects(array);
                });
                setSubjects(
                    array
                )

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
        <>
            <Navbar />
            <div className="home-page">
                <WelcomeComponent text={welcometext} />
                <div className="container-wrapper">
                    <div className="container" id="subjects-container" ref={containerRef}>
                        {subjects}
                    </div>
                    {/*  <div className="button-container">
                        <Button id="openModal" className="edit-button">Добавить / Удалить предмет</Button>
                    </div>*/}
                </div>
            </div>
        </>
    );
};

export default HomePage;
