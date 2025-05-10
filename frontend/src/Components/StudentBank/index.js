import React, { useState, useEffect } from 'react';
import AdminNavbar from '../adminNavbar';
import './styles.css'; // Подключаем CSS файл для стилей

const StudentBank = () => {
    const [classNumber, setClassNumber] = useState('');
    const [classes, setClasses] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = getTokenFromCookie();
        console.log('Token:', token); // Логируем токен для отладки
        if (!token) {
            setError('Токен не найден');
            return;
        }

        // Получение классов
        fetch('http://localhost:8080/users/current-user-classes', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Передаем токен в заголовке
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка получения данных о классах');
                }
                return response.json();
            })
            .then(data => {
                console.log('Полученные данные о классах:', data);
                if (Array.isArray(data)) {
                    setClasses(data);
                } else {
                    setError('Неожиданная структура данных для классов');
                }
            })
            .catch(error => {
                console.error('Ошибка получения данных о классах:', error);
                setError(error.message);
            });
    }, []);

    const getTokenFromCookie = () => {
        const name = "jwtToken=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };

    const fetchUsers = async () => {
        const token = getTokenFromCookie();
        if (!token) {
            setError('Токен не найден');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/users/all', {
                method: 'POST', // Используем метод POST
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Передаем токен в заголовке
                },
                body: JSON.stringify({ classNumber }) // Передаем номер класса в теле запроса
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Ошибка получения данных о пользователях: ${errorText}`);
            }
            const data = await response.json();
            console.log('Все пользователи:', data);
            setSelectedUsers(data);
        } catch (error) {
            console.error('Ошибка получения данных о пользователях:', error);
            setError(`Ошибка: ${error.message}`);
        }
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        fetchUsers();
    };

    const handleClassChange = (e) => {
        const selectedClassId = e.target.value;
        setClassNumber(selectedClassId);
        console.log('Выбранный класс:', selectedClassId); // Логируем выбранный класс для отладки
    };

    return (
        <div>
            <div className="admin-navbar-wrapper">
                <AdminNavbar />
            </div>
            <div className="class-bank-page">
                <div className="class-bank-form-wrapper">
                    <div className="class-bank-form-header">
                        Сортировка пользователей по классу
                    </div>
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    <form onSubmit={handleSubmit} className="class-bank-form-content">
                        <div className="class-bank-form-element">
                            <label htmlFor="classNumber">Класс:</label>
                            <select
                                id="classNumber"
                                value={classNumber}
                                onChange={handleClassChange}
                            >
                                <option value="">Выберите класс</option>
                                {classes.map(cls => (
                                    <option key={cls.id} value={cls.id}>
                                        {`${cls.numberOfInstitution} ${cls.letterDesignation}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </form>
                    <button className="class-bank-create-subject-btn">
                        Создать предмет
                    </button>
                </div>
                {selectedUsers.length > 0 && (
                    <div className="class-bank-selected-class-container-new">
                        <h3>Выбранные пользователи:</h3>
                        {selectedUsers.map(user => (
                            <div key={user.id}>
                                <p>ID: {user.id}</p>
                                <p>Имя: {user.name}</p>
                                <p>Фамилия: {user.surname}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentBank;
