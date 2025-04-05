import React from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import Full_logo from '../../images/Full_logo.png';

const AdminNavbar = ({ onFormSelect }) => {
    const navigate = useNavigate();

    const menuItems = [
        {
            title: "Управление",
            subItems: [
                "Тесты",
                "Задания",
                "Индикаторы",
                "Темы",
                "Предметы",
                "Классы",
                "Ученики"
            ]
        },
        {
            title: "Регистрация",
            subItems: [
                "Одного пользователя",
                "Несколько пользователей",
                "Несколько учеников"
            ]
        },
        {
            title: "Личный кабинет",
            subItems: []
        },
        {
            title: "Результаты",
            subItems: []
        }
    ];

    const handleClick = (item) => {
        if (item === "Одного пользователя") {
            navigate('/bPage?form=singleUser');
        } else if (item === "Несколько учеников") {
            navigate('/bPage?form=multipleStudents');
        } else if (item === "Несколько пользователей") {
            navigate('/bPage?form=multipleUsers');
        } else if (item === "Классы") {
            navigate('/ClassBank');
        }
    };


    return (
        <div className="anavbar">
            <div className="alogo">
                <img
                    src={Full_logo}
                    width="40"
                    height="40"
                    className="d-inline-block align-top"
                    alt="Logo"
                />
            </div>
            <nav className="amenu">
                <ul>
                    {menuItems.map((item, index) => (
                        <li
                            key={index}
                            className={`main-item ${item.title === "Личный кабинет" || item.title === "Результаты" ? "clickable" : ""}`}
                            onClick={item.title === "Личный кабинет" || item.title === "Результаты" ? () => handleClick(item.title) : null}
                        >
                            {item.title}
                            {item.subItems.length > 0 && (
                                <ul className="submenu">
                                    {item.subItems.map((subItem, subIndex) => (
                                        <li
                                            key={subIndex}
                                            className="sub-item"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleClick(subItem);
                                            }}
                                        >
                                            {subItem}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default AdminNavbar;
