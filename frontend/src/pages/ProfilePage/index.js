import React, { useState, useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import avatarImage from '../../images/аватар.jpg';
import './styles.css';
import Navbar from "../../Components/UIModule/Navbar";
import Footer from "../../Components/UIModule/Footer";
import Question from "../../Components/TestingModule/Question";
import SubjectCard from "../../Components/TestingModule/SubjectCard";
import { useOutletContext } from 'react-router-dom';
import subjectCardForClass from "../../Components/BankModule/SubjectCardForClass";

const ProfilePage = () => {
    localStorage.setItem('info', "Здесь Вы можете увидеть Ваши персональные данные.");

    const navigate = useNavigate();
    const [userState, setUserState] = useState();
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [patronymic, setPatronymic] = useState("");
    const [login, setLogin] = useState("");
    const [role, setRole] = useState("");
    const [studentSchool, setStudentSchool] = useState("");
    const [studentClass, setStudentClass] = useState("");
    const [email, setEmail] = useState("");
    const [portraitUrl, setPortraitUrl] = useState(avatarImage);
    const [topText, setTopText] = useOutletContext();

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await fetch(process.env.REACT_APP_SERVER_URL + 'users/current', {
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error('Ошибка получения пользователя');
                }
                const user = await response.json();
                console.log(user);
                setUserState(user);
                setName(user.name);
                setSurname(user.surname);
                setPatronymic(user.patronymic);
                setLogin(user.login);
                setRole(user.role.role);
                setEmail(user.email);
                console.log('http://26.188.252.197:9000/smart-test/' + user.portraitUrl);
                if (user.portraitUrl) {
                    setPortraitUrl('http://26.188.252.197:9000/smart-test/' + user.portraitUrl);
                } else {
                    setPortraitUrl(avatarImage);
                }

                const response2 = await fetch(process.env.REACT_APP_SERVER_URL + `student-class/teacherid=${user.id}`, {
                    credentials: "include",
                });
                if (!response2.ok) {
                    throw new Error('Ошибка получения пользователя');
                }
                const studentClass = await response2.json();
                console.log(studentClass);
                let result = "";
                studentClass.forEach(sc => {
                    result += sc.numberOfInstitution + " " + sc.letterDesignation + " ";
                });
                setStudentClass(result);

                const response3 = await fetch(process.env.REACT_APP_SERVER_URL + 'users/find-educational-institution-by-user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user)
                });
                if (!response.ok) {
                    throw new Error('Ошибка получения данных об образовательном учреждении');
                }
                const schoolJson = await response3.json();
                setStudentSchool(schoolJson.nameOfTheInstitution);
                setTopText("Личный кабинет");
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

    const handleLogout = () => {
        document.cookie = "sub=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
        document.cookie = "test=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
        document.cookie = "accessToken=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
        document.cookie = "refreshToken=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
        navigate("/");
    };

    return (
        <div className="page-container">
            <div className="content-wrapper">
                <Container className="profile-container">
                    <div className="profile-section">
                        <img src={portraitUrl} alt="Портрет" className="profile-image" />
                        <div className="profile-info">
                            <h5>Информация о пользователе</h5>
                            <p><strong>Имя:</strong> {name}</p>
                            <p><strong>Фамилия:</strong> {surname}</p>
                            <p><strong>Отчество:</strong> {patronymic}</p>
                            <p><strong>Логин:</strong> {login}</p>
                            <p><strong>Статус:</strong> {role}</p>
                            <p><strong>Образовательное учреждение:</strong> {studentSchool}</p>
                            {role !== "Ученик" ? <></> : <p><strong>Класс:</strong> {studentClass}</p>}
                            <p><strong>Электронная почта:</strong> {email}</p>
                        </div>
                    </div>
                    <div className="profile-buttons">
                        <Button variant="danger" className="logout-button" onClick={handleLogout}>Выйти из аккаунта</Button>
                    </div>
                </Container>
            </div>
        </div>
    );
};

export default ProfilePage;
