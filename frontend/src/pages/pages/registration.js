import React, { useState } from 'react';
import '../css/StyleForRegistration.css'; // Убедитесь, что файл стилей доступен
import '../css/registration_modal.css'; // Убедитесь, что файл стилей доступен

const RegistrationPage = () => {
    const [formData, setFormData] = useState({
        role: '',
        surname: '',
        name: '',
        patronymic: '',
        email: '',
        educationPlace: '',
        class: '',
    });

    const [errors, setErrors] = useState({
        surname: '',
        name: '',
        patronymic: '',
        email: '',
        educationPlace: '',
        class: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Убираем лишние пробелы и недопустимые символы
        let filteredValue = value.replace(/\s+/g, '').replace(/[^а-яА-Яa-zA-Z\-]/g, '');
        setFormData({
            ...formData,
            [name]: filteredValue
        });
    };

    const handleEmailChange = (e) => {
        const { value } = e.target;
        setFormData({
            ...formData,
            email: value.replace(/\s+/g, '')
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        validateForm();
    };

    const validateForm = () => {
        let newErrors = { surname: '', name: '', patronymic: '', email: '', educationPlace: '', class: '' };
        let hasError = false;

        if (!formData.surname) {
            newErrors.surname = 'Фамилия обязательна';
            hasError = true;
        }
        if (!formData.name) {
            newErrors.name = 'Имя обязательно';
            hasError = true;
        }
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Введите корректный email';
            hasError = true;
        }
        // Добавьте дополнительные проверки по необходимости

        setErrors(newErrors);
        if (!hasError) {
            // Отправить данные на сервер
            console.log('Регистрация данных:', formData);
        }
    };

    return (
        <div>
            <h1>Регистрация</h1>

            <form id="registrationForm" onSubmit={handleSubmit}>
                <label htmlFor="role">Роль:</label>
                <select id="role" name="role" required onChange={handleChange}>
                    <option value="">Выберите роль</option>
                    {/* Добавьте ваши варианты ролей здесь */}
                </select>

                <label htmlFor="surname">Фамилия:</label>
                <input type="text" id="surname" name="surname" maxLength="50" required value={formData.surname} onChange={handleChange} />
                <div className="error-message">{errors.surname}</div>

                <label htmlFor="name">Имя:</label>
                <input type="text" id="name" name="name" maxLength="30" required value={formData.name} onChange={handleChange} />
                <div className="error-message">{errors.name}</div>

                <label htmlFor="patronymic">Отчество:</label>
                <input type="text" id="patronymic" name="patronymic" maxLength="40" value={formData.patronymic} onChange={handleChange} />
                <div className="error-message">{errors.patronymic}</div>

                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" maxLength="80" required value={formData.email} onChange={handleEmailChange} />
                <div className="error-message">{errors.email}</div>

                <label htmlFor="educationPlace">Место обучения:</label>
                <select id="educationPlace" name="educationPlace" required onChange={handleChange}>
                    <option value="">Выберите место обучения</option>
                    {/* Добавьте ваши варианты мест обучения здесь */}
                </select>
                <div className="error-message">{errors.educationPlace}</div>

                <label htmlFor="class">Класс:</label>
                <select id="class" name="class" required onChange={handleChange}>
                    <option value="">Выберите класс</option>
                    {/* Добавьте ваши варианты классов здесь */}
                </select>
                <div className="error-message">{errors.class}</div>

                <button type="submit">Зарегистрировать пользователя</button>
                <button type="button" onClick={() => window.history.back()}>Назад</button>
            </form>
        </div>
    );
};

export default RegistrationPage;
