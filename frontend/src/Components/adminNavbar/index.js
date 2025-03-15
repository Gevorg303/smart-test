import React from 'react';
import './style.css';
import Full_logo from '../../images/Full_logo.png'; // Импортируем изображение

const aNavbar = () => {
    const menuItems = [
        {
            title: "Управление",
            subItems: [
                "Тесты",
                "Задания",
                "Индикаторы",
                "Темы",
                "Предметы",
                "Классы"
            ]
        },
        {
            title: "Регистрация",
            subItems: [
                "Одного ученика",
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
        console.log('Clicked:', item);
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
                                                e.stopPropagation(); // Предотвращает всплытие события
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

export default aNavbar;