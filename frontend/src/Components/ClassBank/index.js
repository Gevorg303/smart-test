import React, { useState, useEffect } from 'react';
import AdminNavbar from '../adminNavbar';
import './styles.css';
import BankCard from '../BankCard';
import CreateClassPage from '../CreateClassPage';

const ClassBank = () => {
    const [classes, setClasses] = useState([]);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [editItem, setEditItem] = useState(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const token = getTokenFromCookie();
                if (!token) {
                    setError('Токен не найден');
                    return;
                }

                const response = await fetch('http://localhost:8081/users/current', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (!response.ok) {
                    throw new Error('Ошибка получения данных о текущем пользователе');
                }

                const user = await response.json();
                setCurrentUser(user);
                return user;
            } catch (error) {
                console.error('Ошибка получения данных о текущем пользователе:', error);
                setError(error.message);
                return null;
            }
        };

        const fetchClasses = async (user) => {
            try {
                const token = getTokenFromCookie();
                if (!token) {
                    setError('Токен не найден');
                    return;
                }

                const response = await fetch('http://localhost:8081/users/find-student-class-by-user', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(user)
                });

                if (!response.ok) {
                    throw new Error('Ошибка получения данных о классах');
                }

                const data = await response.json();
                if (Array.isArray(data)) {
                    setClasses(data);
                } else {
                    setError('Неожиданная структура данных для классов');
                }
            } catch (error) {
                console.error('Ошибка получения данных о классах:', error);
                setError(error.message);
            }
        };

        fetchCurrentUser().then(user => {
            if (user) {
                fetchClasses(user);
            }
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

    return (
        <div>
            <div className="admin-navbar-wrapper">
                <AdminNavbar />
            </div>
            <div className="class-bank-page">
                <div className="class-bank-form-wrapper">
                    <div className="class-bank-form-header">
                        Список классов
                    </div>
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    <div className="class-list">
                        {classes.map(cls => (
                            <BankCard
                                key={cls.id}
                                id={cls.id}
                                objectItem={cls}
                                type="class"
                                setEditItem={setEditItem}
                            />
                        ))}
                    </div>
                </div>
            </div>
            {editItem && <CreateClassPage editItem={editItem} onCreate={() => {}} onError={() => {}} currentUser={currentUser} />}
        </div>
    );
};

export default ClassBank;
