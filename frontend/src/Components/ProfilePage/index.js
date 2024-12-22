import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import avatarImage from '../../images/аватар.jpg'; // Исправленный путь к изображению
import './styles.css';
import Navbar from "../Navbar"; // Импортируем файл стилей

const ProfilePage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Логика выхода из аккаунта
        navigate("/login"); // Перенаправление на страницу логина или другую страницу
    };

    return (
        <>
            <Navbar/>
        <Container className="profile-container">
            <div className="profile-section">
                <img src={avatarImage} alt="Портрет" className="profile-image"/>
                <div className="profile-info">
                    <h5>Информация о пользователе</h5>
                    <p><strong>Имя:</strong> Вася</p>
                    <p><strong>Фамилия:</strong> Пупкин</p>
                    <p><strong>Отчество:</strong> Олегович</p>
                    <p><strong>Имя пользователя:</strong> vasya</p>
                    <p><strong>Статус:</strong> Ученик</p>
                    <p><strong>Класс:</strong> 7б</p>
                    <p><strong>Электронная почта:</strong> vasya@example.com</p>
                </div>
            </div>
            <div className="profile-buttons">
                <Button variant="danger" className="logout-button" onClick={handleLogout}>Выйти из аккаунта</Button>
            </div>
        </Container>
        </>
    );
};

export default ProfilePage;
