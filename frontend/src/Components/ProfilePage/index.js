import React, {useState, useEffect} from 'react';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import avatarImage from '../../images/аватар.jpg'; // Исправленный путь к изображению
import './styles.css';
import Navbar from "../Navbar";
import Footer from "../Footer";
import Question from "../Question";
import SubjectCard from "../SubjectCard"; // Импортируем файл стилей
import { useOutletContext } from 'react-router-dom';
import subjectCardForClass from "../SubjectCardForClass";

const ProfilePage = () => {

    localStorage.setItem('info', "Здесь вы можете увидеть ваши данные личного кабинета");

    const navigate = useNavigate();
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
                console.log('http://26.188.252.197:9000/smart-test/'+user.portraitUrl)
                if(user.portraitUrl) {
                    setPortraitUrl('http://26.188.252.197:9000/smart-test/'+user.portraitUrl);
                }else{
                    setPortraitUrl(avatarImage)
                }

                const response2 = await fetch(`http://localhost:8080/student-class/teacherid=${user.id}`, {
                    credentials: "include",
                });
                if (!response2.ok) {
                    throw new Error('Ошибка получения пользователя');
                }
                const studentClass = await response2.json();
                console.log(studentClass);
                let result = "";
                let result_sch = "";
                studentClass.forEach(sc => {
                   result += sc.numberOfInstitution + " " + sc.letterDesignation + "; "
                   result_sch+= sc.educationalInstitution.nameOfTheInstitution + "; "
                });
                setStudentClass(result);
                setStudentSchool(result_sch);
                //setStudentClass(studentClass);
                setTopText("Личный кабинет");
            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }
        fetchUser();
    },[setTopText]);
    return (
        <div className="page-container">
            <div className="content-wrapper">
                <Container className="profile-container">
                    <div className="profile-section">
                        <img src={portraitUrl} alt="Портрет" className="profile-image" />
                        <div className="profile-info">
                            <h5>Информация о пользователе</h5>
                            <p><strong>Имя:</strong> {name} </p>
                            <p><strong>Фамилия:</strong> {surname} </p>
                            <p><strong>Отчество:</strong> {patronymic} </p>
                            <p><strong>Логин:</strong> {login} </p>
                            <p><strong>Статус:</strong> {role} </p>
                            <p><strong>Образовательное учреждение:</strong> {studentSchool} </p>
                            <p><strong>Класс:</strong> {studentClass} </p>
                            <p><strong>Электронная почта:</strong> {email} </p>
                        </div>
                    </div>
                    <div className="profile-buttons">
                        <Button variant="danger" className="logout-button" onClick={handleLogout}>Выйти из аккаунта</Button>
                    </div>
                </Container>
            </div>
            {/*<Footer />*/}
        </div>
    );
};

export default ProfilePage;
