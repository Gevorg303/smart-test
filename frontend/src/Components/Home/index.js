import React, { useState, useEffect } from 'react';
import SubjectCard from "../SubjectCard";
import WelcomeComponent from "../WelcomeComponent";
import "../Home/styles.css"


const HomePage = () => {

    var welcomeText ="";

    useEffect( () => {
        async function fetchUser() {
            try {
                document.cookie = "sub=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
                const response = await fetch('http://localhost:8080/users/current',{
                    credentials: "include",
                });
                if (!response.ok) {
                   // throw new Error('Ошибка сети');
                }
                const user = await response.json();
                //  const welcome = document.getElementById('welcome');
                console.log(user);
                /*   welcome.innerHTML*/ welcomeText = "Здравствуйте, "+user.name + " ("+user.role.role + ")";
                /* subjects.forEach(subject => {
                     const card = createSubjectCard(subject);
                     container.appendChild(card);
                 });*/
            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }
        fetchUser();

    });


    return (
        <div>
           <WelcomeComponent text={welcomeText}/>
            <div className="container" id="subjects-container">
                <SubjectCard name='Subject1' id='1'/>
                <SubjectCard name='Subject2' id='2' description='description'/>
                <SubjectCard name='Subject3' id='3'/>
            </div>
            <div className="button-container">
                <button id="openModal" className="edit-button" >Добавить / Удалить предмет</button>
            </div>

        </div>
    );
};

export default HomePage;
