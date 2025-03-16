import React, { useState } from 'react';
import './style.css'; // Импортируем стили для формы регистрации

const AdminRegistrationForm = () => {
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        middleName: '',
        education: '',
        class: '',
        email: '',
        role: ''
    });

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
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled selected>Место обучения</option>
                    {/* Добавьте опции динамически */}
                </select>
            </div>
            <div className="form-group">
                <input
                    type="text"
                    id="class"
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                    placeholder="Класс"
                    required
                />
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
                <input
                    type="text"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="Роль"
                    required
                />
            </div>
            <button type="submit" className="submit-button">
                Зарегистрировать
            </button>
        </form>
    );
};

export default AdminRegistrationForm;
