import React, { useState, useEffect } from 'react';
import './style.css';
import * as XLSX from 'xlsx';

const AdminRegistrationForm = ({ selectedForm }) => {
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        middleName: '',
        class: '',
        email: '',
        role: ''
    });

    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [selectedClass, setSelectedClass] = useState(null);
    const [classes, setClasses] = useState([]);
    const [users, setUsers] = useState([]);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const roleMapping = {
        'Админ': 1,
        'Учитель': 2,
        'Ученик': 3
    };

    useEffect(() => {
        const fetchClassesAndUsers = async () => {
            try {
                const classesResponse = await fetch('http://localhost:8080/users/current-user-classes', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!classesResponse.ok) {
                    throw new Error('Ошибка получения данных о классах');
                }
                const classesData = await classesResponse.json();
                if (Array.isArray(classesData)) {
                    setClasses(classesData);
                } else {
                    console.error('Неожиданная структура данных для классов:', classesData);
                }

                const usersResponse = await fetch('http://localhost:8080/users/all', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!usersResponse.ok) {
                    throw new Error('Ошибка получения данных о пользователях');
                }
                const usersData = await usersResponse.json();
                console.log('Все пользователи при загрузке страницы:', usersData);
                setUsers(usersData);
            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        };

        fetchClassesAndUsers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setShowSuccessToast(false);

        const userRequest = {
            user: {
                surname: formData.lastName,
                name: formData.firstName,
                patronymic: formData.middleName,
                role: { id: roleMapping[formData.role] },
                email: formData.email,
                educationalInstitution: { id: parseInt(formData.class, 10) } // Добавляем поле educationalInstitution
            },
            studentClass: { id: parseInt(formData.class, 10) }
        };

        try {
            const response = await fetch('http://localhost:8080/users/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([userRequest]),
            });

            if (response.ok) {
                setShowSuccessToast(true);
                setFormData({
                    lastName: '',
                    firstName: '',
                    middleName: '',
                    class: '',
                    email: '',
                    role: ''
                });
                await fetchUsers(); // Обновляем список пользователей после регистрации
            } else {
                const errorText = await response.text();
                throw new Error(`Ошибка регистрации пользователя: ${errorText}`);
            }
        } catch (error) {
            console.error('Ошибка регистрации пользователя:', error);
            setErrorMessage(error.message);
        }
    };

    const handleMultipleRegistration = async () => {
        if (!file) {
            setErrorMessage('Файл не выбран');
            setShowErrorToast(true);
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            const userRequests = [];
            const errors = [];

            jsonData.slice(1).forEach((row, index) => {
                const [lastName, firstName, middleName, email] = row;
                const rowErrors = [];

                if (!lastName || !isValidName(lastName)) {
                    rowErrors.push('Фамилия');
                }
                if (!firstName || !isValidName(firstName)) {
                    rowErrors.push('Имя');
                }
                if (!middleName || !isValidName(middleName)) {
                    rowErrors.push('Отчество');
                }
                if (!email || !isValidEmail(email)) {
                    rowErrors.push('Эл. почта');
                }

                if (rowErrors.length > 0) {
                    errors.push(`Строка ${index + 2}: Заполнено некорректно: ${rowErrors.join(', ')}`);
                    return;
                }

                const isEmailRegistered = users.some(user => user.email === email);
                if (isEmailRegistered) {
                    errors.push(`Строка ${index + 2}: Пользователь с почтой ${email} уже зарегистрирован`);
                    return;
                }

                userRequests.push({
                    user: {
                        surname: lastName,
                        name: firstName,
                        patronymic: middleName,
                        role: { id: 3 },
                        email: email,
                        educationalInstitution: { id: parseInt(selectedClass, 10) } // Добавляем поле educationalInstitution
                    },
                    studentClass: { id: parseInt(selectedClass, 10) }
                });
            });

            if (errors.length > 0) {
                setErrorMessage(errors.join('\n'));
                setShowErrorToast(true);
                return;
            }

            if (userRequests.length === 0) {
                setErrorMessage('Строки в файле заполнены некорректно, либо пользователь был ранее зарегистрирован');
                setShowErrorToast(true);
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/users/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userRequests),
                });

                if (response.ok) {
                    const answers = await response.json();
                    setShowSuccessToast(true);
                    setSelectedClass(null); // Clear selected class
                    await fetchUsers(); // Обновляем список пользователей после регистрации

                    // Generate and download XLS file
                    const userDetails = answers.map((item, index) => ({
                        ФИО: `${item.surname} ${item.name} ${item.patronymic}`,
                        Логин: item.login,
                        Пароль: item.rawPassword
                    }));
                    downloadXLS(userDetails, 'UserDetails');
                }
            } catch (error) {
                console.error('Ошибка регистрации пользователей:', error);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleDownloadTemplate = (templateName) => {
        const link = document.createElement('a');
        link.href = `/${templateName}.xlsx`;
        link.download = `${templateName}.xlsx`;
        link.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFile(file);
            setFileName(file.name);
        } else {
            setFile(null);
            setFileName('');
        }
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isValidName = (name) => {
        const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;
        return nameRegex.test(name);
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8080/users/all');
            if (!response.ok) {
                throw new Error('Ошибка получения данных о пользователях');
            }
            const data = await response.json();
            console.log('Все пользователи после регистрации:', data);
            setUsers(data);
        } catch (error) {
            console.error('Ошибка получения данных о пользователях:', error);
        }
    };

    const downloadXLS = (data, filename) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
        XLSX.writeFile(workbook, `${filename}.xlsx`);
    };

    if (selectedForm === 'singleUser') {
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
                            <option key={cls.id} value={cls.id}>
                                {`${cls.numberOfInstitution} ${cls.letterDesignation}`}
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
                        {Object.keys(roleMapping).map(roleName => (
                            <option key={roleMapping[roleName]} value={roleName}>
                                {roleName}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="single-user-submit-button">
                    Зарегистрировать
                </button>
                {showSuccessToast && <p>Пользователь успешно зарегистрирован!</p>}
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            </form>
        );
    }

    if (selectedForm === 'multipleStudents' || selectedForm === 'multipleUsers') {
        return (
            <form className="registration-form" onSubmit={handleMultipleRegistration}>
                <h2 className="form-title">
                    {selectedForm === 'multipleStudents' ? 'Регистрация нескольких учеников' : 'Регистрация нескольких пользователей'}
                </h2>
                {selectedForm === 'multipleStudents' && (
                    <div className="form-group">
                        <select
                            id="class"
                            name="class"
                            value={selectedClass || ''}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            required
                        >
                            <option value="" disabled>Выберите класс</option>
                            {classes.map(cls => (
                                <option key={cls.id} value={cls.id}>
                                    {`${cls.numberOfInstitution} ${cls.letterDesignation}`}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <div className="form-group file-input-container">
                    <input
                        type="file"
                        className="file-input"
                        onChange={handleFileChange}
                    />
                    {fileName && <span className="file-input-display">Выбранный файл: {fileName}</span>}
                </div>
                <div className="button-container">
                    <button type="submit" className="multiple-users-button">
                        Зарегистрировать
                    </button>
                    <button
                        type="button"
                        className="multiple-users-button template-button"
                        onClick={() => handleDownloadTemplate(selectedForm === 'multipleStudents' ? 'Ученики' : 'Пользователи')}
                    >
                        Выгрузить шаблон
                    </button>
                </div>
                {showSuccessToast && <p>Пользователи успешно зарегистрированы!</p>}
                {showErrorToast && <p style={{ color: 'red' }}>{errorMessage}</p>}
            </form>
        );
    }

    return null;
};

export default AdminRegistrationForm;
