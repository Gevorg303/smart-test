import React from 'react';
import './styles.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <a href="/home">
                    <img src="../../images/logo192.png" alt="Logo"/>
                </a>
            </div>
            <ul className="navbar-links">
                <li className="navbar-item">
                <a href="/home" className="navbar-link">Предметы</a>
                </li>
                <li className="navbar-item">
                    <a href="/register" className="navbar-link">Зарегистрировать пользователя</a>
                </li>
                <li className="navbar-item">
                    <a  className="navbar-link">Справка</a>
                </li>
            </ul>
            <ul className="navbar-links right">
                <li className="navbar-item">
                    <a  className="navbar-link">
                        <i className="bi bi-bell"></i>
                    </a>
                </li>
                <li className="navbar-item">
                    <a  className="navbar-link">
                        <i className="bi bi-messenger"></i>
                    </a>
                </li>
                <li className="navbar-item">
                    <a href="/profile" className="navbar-link">Личный кабинет</a>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;