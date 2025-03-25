import React, { useState, useEffect } from 'react';
import './style.css'; // Импортируем стили для формы регистрации

const AdminRegistrationForm = () => {
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        middleName: '',
        class: '',
        email: '',
        role: ''
    });

    const [classes, setClasses] = useState([]);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        // Fetch classes for the current user
        fetch('/users/current-user-classes', {
            credentials: 'include' // Включаем куки для отправки JWT токена
        })
            .then(response => response.json())
            .then(data => setClasses(data))
            .catch(error => console.error('Error fetching classes:', error));

        // Fetch roles from the database
        fetch('/api/roles')
            .then(response => response.json())
            .then(data => setRoles(data))
            .catch(error => console.error('Error fetching roles:', error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Обработка отправки формы
    };

    return (
        <form className="registration-form" onSubmit={handleSubmit}>
            <h2 className="form-title">Регистрация</h2>
            <div className="form-group">
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Фамилия"
                    required
                />
            </div>
            <div className="form-group">
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Имя"
                    required
                />
            </div>
            <div className="form-group">
                <input
                    type="text"
                    id="middleName"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    placeholder="Отчество"
                    required
                />
            </div>
            <div className="form-group">
                <select
                    id="class"
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Выберите класс</option>
                    {classes.map(cls => (
                        <option key={cls.id} value={cls.name}>
                            {cls.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Почта"
                    required
                />
            </div>
            <div className="form-group">
                <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Выберите роль</option>
                    {roles.map(role => (
                        <option key={role.id} value={role.name}>
                            {role.name}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit" className="submit-button">
                Зарегистрировать
            </button>
        </form>
    );
};

export default AdminRegistrationForm;
