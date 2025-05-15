import React, { useState, useEffect, useRef } from 'react';
import SubjectCard from "../SubjectCard";
import "../Home/styles.css";
import { useOutletContext } from 'react-router-dom';

const HomePage = () => {
    const containerRef = useRef(null);
    const containerRef2 = useRef(null);
    const [subjects, setSubjects] = useState([]);
    const [topText, setTopText] = useOutletContext();

    localStorage.setItem('info', "Здесь находятся ваши предметы");

    useEffect(() => {
        async function fetchUser() {
            try {
                document.cookie = "sub=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                document.cookie = "test=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                const response = await fetch(process.env.REACT_APP_SERVER_URL+'/users/current', {
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
                const user = await response.json();
                console.log(user);
                setTopText("Здравствуйте, " + user.name + " (" + user.role.role + ")");

                const container = document.querySelector('.all-container');
                container.classList.add('page-style-1');

                const response2 = await fetch(process.env.REACT_APP_SERVER_URL+'/subject/print-user-subject', {
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
    }, [setTopText]);

    /*useEffect(() => {
        const adjustStyleBasedOnHeight = () => {
            const element = containerRef.current;
            if (element) {
                const height = element.offsetHeight;
                if (height > 200) {
                    element.style.backgroundColor = 'lightblue';

                } else {
                    element.style.backgroundColor = 'lightgray';
                    element.style.marginBottom = '220px'; // Указываем единицы измерения
                }
            }
        };

        // Вызовите функцию при монтировании компонента
        adjustStyleBasedOnHeight();

        // Вызовите функцию при изменении размера окна
        window.addEventListener('resize', adjustStyleBasedOnHeight);

        // Очистка события при размонтировании компонента
        return () => {
            window.removeEventListener('resize', adjustStyleBasedOnHeight);
        };
    }, [subjects]);

*/
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
