import React from 'react';
import '../css/StyleForAccount.css';
import avatar from '../аватар.jpg';

const Contact = () => {
    return (
        <div>
            <h1 className="text-center my-4">Личные данные</h1>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-auto photo">
                        <img src={avatar} alt="Фотография пользователя" className="img-fluid"/>
                    </div>
                    <div className="col data mt-4">
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