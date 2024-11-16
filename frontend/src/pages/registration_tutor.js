import React, { useState } from 'react';
import './styles.css'; // Убедитесь, что файл стилей доступен

const TeacherRegistration = () => {
    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        mname: '',
        email: '',
        login: '',
        password: '',
        superuser: false,
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const validateForm = () => {
        const newErrors = {};
        const { fname, lname, mname, email, login, password } = formData;

        // Проверка имени
        if (!/^[А-Яа-яA-Za-z]{2,15}$/.test(fname)) {
            newErrors.fname = 'Имя должно содержать от 2 до 15 букв.';
        }
        // Проверка фамилии
        if (!/^[А-Яа-яA-Za-z]+(-[А-Яа-яA-ZaazolA-Za-z]+)?(\s[А-Яа-яA-Za-z]+(-[А-Яа-яA-Za-z]+)?)?$/.test(lname)) {
            newErrors.lname = 'Фамилия некорректна.';
        }
        // Проверка отчества
        if (mname && !/^[А-Яа-яA-Za-z]{2,20}$/.test(mname)) {
            newErrors.mname = 'Отчество должно содержать от 2 до 20 букв.';
        }
        // Проверка email
        if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Неверный формат email.';
        }
        // Проверка логина
        if (!/.{6,}/.test(login)) {
            newErrors.login = 'Логин должен содержать не менее 6 символов.';
        }
        // Проверка пароля
        if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}/.test(password)) {
            newErrors.password = 'Пароль должен содержать минимум 8 символов, включая цифры, строчные и заглавные буквы и спецсимволы.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Регистрация данных:', formData);
            // Здесь можно добавить логику для отправки данных
        }
    };

    return (
        <div className="container">
            <h1>Регистрация учителя</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="fname">Имя:</label>
                <input
                    type="text"
                    id="fname"
                    name="fname"
                    value={formData.fname}
                    onChange={handleChange}
                    required
                />
                <div className="error-message">{errors.fname}</div>

                <label htmlFor="lname">Фамилия:</label>
                <input
                    type="text"
                    id="lname"
                    name="lname"
                    value={formData.lname}
                    onChange={handleChange}
                    required
                />
                <div className="error-message">{errors.lname}</div>

                <label htmlFor="mname">Отчество:</label>
                <input
                    type="text"
                    id="mname"
                    name="mname"
                    value={formData.mname}
                    onChange={handleChange}
                />
                <div className="error-message">{errors.mname}</div>

                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <div className="error-message">{errors.email}</div>

                <label htmlFor="login">Логин:</label>
                <input
                    type="text"
                    id="login"

                    name="login"
                    value={formData.login}
                    onChange={handleChange}
                    required
                />
                <div className="error-message">{errors.login}</div>

                <label htmlFor="password">Пароль:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <div className="error-message">{errors.password}</div>

                <label htmlFor="superuser">Суперпользователь:</label>
                <input
                    type="checkbox"
                    id="superuser"
                    name="superuser"
                    checked={formData.superuser}
                    onChange={handleChange}
                />

                <input type="submit" value="Зарегистрироваться" />
            </form>
        </div>
    );
};

export default TeacherRegistration;
