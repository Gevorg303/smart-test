import React, {useState, useEffect} from 'react';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import avatarImage from '../../images/аватар.jpg'; // Исправленный путь к изображению
import './styles.css';
import Navbar from "../Navbar";
import Footer from "../Footer";
import Question from "../Question";
import SubjectCard from "../SubjectCard"; // Импортируем файл стилей

const ProfilePage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("Вася");
    const [surname, setSurname] = useState("Пупкин");
    const [patronymic, setPatronymic] = useState("Олегович");
    const [login, setLogin] = useState("VPOlegovich11");
    const [role, setRole] = useState("Учитель");
    const [studentClass, setStudentClass] = useState("7Б");
    const [email, setEmail] = useState("example@mail.ru");

    const handleLogout = () => {
        // Логика выхода из аккаунта
        document.cookie = "sub=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
        document.cookie = "test=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
        document.cookie = "jwtToken=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
        navigate("/"); // Перенаправление на страницу логина или другую страницу
    };
    useEffect( () => {
        async function fetchUser() {
            try {
                const response = await fetch('http://localhost:8080/users/current', {
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error('Ошибка получения пользователя');
                }
                const user = await response.json();
                console.log(user);
                setName(user.name);
                setSurname(user.surname);
                setPatronymic(user.patronymic);
                setLogin(user.login);
                setRole(user.role.role);
                setEmail(user.email);

                const response2 = await fetch(`http://localhost:8080/student-class/teacherid=${user.id}`, {
                    credentials: "include",
                });
                if (!response2.ok) {
                    throw new Error('Ошибка получения пользователя');
                }
                const studentClass = await response2.json();
                console.log(studentClass);
                let result = "";
                studentClass.forEach(sc => {
                   result += sc.numberOfInstitution + " " + sc.letterDesignation + "; "
                });
                setStudentClass(result);
                //setStudentClass(studentClass);

            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }
        fetchUser();
    },[]);
    return (
        <div className="page-container">
            <Navbar />
            <div className="content-wrapper">
                <Container className="profile-container">
                    <div className="profile-section">
                        <img src={avatarImage} alt="Портрет" className="profile-image" />
                        <div className="profile-info">
                            <h5>Информация о пользователе</h5>
                            <p><strong>Имя:</strong> {name} </p>
                            <p><strong>Фамилия:</strong> {surname} </p>
                            <p><strong>Отчество:</strong> {patronymic} </p>
                            <p><strong>Логин:</strong> {login} </p>
                            <p><strong>Статус:</strong> {role} </p>
                            <p><strong>Класс:</strong> {studentClass} </p>
                            <p><strong>Электронная почта:</strong> {email} </p>
                        </div>
                    </div>
                    <div className="profile-buttons">
                        <Button variant="danger" className="logout-button" onClick={handleLogout}>Выйти из аккаунта</Button>
                    </div>
                </Container>
            </div>
            <Footer />
        </div>
    );
};

export default ProfilePage;
