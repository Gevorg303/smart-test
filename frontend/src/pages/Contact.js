import React from 'react';
import './StyleForAccount.css';
//import 'bootstrap/dist/css/bootstrap.min.css';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faBell, faComments } from '@fortawesome/free-solid-svg-icons';

const Contact = () => {
    return (
        <div>
            <nav className="d-flex justify-content-between p-3">
                <div className="flex-row">
                    <img className="w-8 h-8" src="/images/в.png" alt="Логотип" />
                    <a href="main" className="mx-2">Предметы</a>
                    <a href="registration" id="adduserbutton" className="mx-2">Зарегистрировать пользователя</a>
                    <a href="#Справка" className="mx-2">Справка</a>
                    <div className="fill"> </div>

                    <a href="account" className="mx-2">Личный кабинет</a>
                </div>
            </nav>

            <h1 className="text-center my-4">Личные данные</h1>

            <div className="container">
                <div className="photo text-center">
                    <img src="/images/аватар.png" alt="Фотография пользователя" className="img-fluid" />
                </div>
                <div className="data mt-4">
                    <div className="data mb-2">
                        <label htmlFor="surname">Фамилия:</label>
                        <span id="surname">Иванов</span>
                    </div>
                    <div className="data mb-2">
                        <label htmlFor="name">Имя:</label>
                        <span id="name">Иван</span>
                    </div>
                    <div className="data mb-2">
                        <label htmlFor="patronymic">Отчество:</label>
                        <span id="patronymic">Иванович</span>
                    </div>
                    <div className="data mb-2">
                        <label htmlFor="email">Email:</label>
                        <span id="email">ivan.ivanov@example.com</span>
                    </div>
                    <div className="data mb-2">
                        <label htmlFor="role">Роль:</label>
                        <span id="role">Учитель</span>
                    </div>
                </div>
            </div>

            <div className="text-center my-4">
                <a href="main" className="btn btn-secondary mx-2">Назад</a>
                <a href="login" className="btn btn-danger mx-2">Выйти из аккаунта</a>
            </div>

            <footer className="text-center mt-5">
                <p>&copy; Информация о сайте</p>
            </footer>
        </div>
    );
};

export default Contact;