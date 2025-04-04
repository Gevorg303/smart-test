import React, { useState, useEffect } from 'react';
import './style.css'; // Убедитесь, что путь к файлу стилей правильный
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
        fetch('http://localhost:8080/users/current-user-classes', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка получения данных о классах');
                }
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setClasses(data);
                } else {
                    console.error('Неожиданная структура данных для классов:', data);
                }
            })
            .catch(error => console.error('Ошибка получения данных о классах:', error));
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
                email: formData.email
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
                        email: email
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
                    await fetchUsers();

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
            console.log('Все пользователи:', data);
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
        return React.createElement(
            'form',
            { className: 'registration-form', onSubmit: handleSubmit },
            React.createElement('h2', { className: 'form-title' }, 'Регистрация'),
            React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement('input', {
                    type: 'text',
                    id: 'lastName',
                    name: 'lastName',
                    value: formData.lastName,
                    onChange: handleChange,
                    placeholder: 'Фамилия',
                    required: true
                })
            ),
            React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement('input', {
                    type: 'text',
                    id: 'firstName',
                    name: 'firstName',
                    value: formData.firstName,
                    onChange: handleChange,
                    placeholder: 'Имя',
                    required: true
                })
            ),
            React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement('input', {
                    type: 'text',
                    id: 'middleName',
                    name: 'middleName',
                    value: formData.middleName,
                    onChange: handleChange,
                    placeholder: 'Отчество',
                    required: true
                })
            ),
            React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement(
                    'select',
                    {
                        id: 'class',
                        name: 'class',
                        value: formData.class,
                        onChange: handleChange,
                        required: true
                    },
                    React.createElement('option', { value: '', disabled: true }, 'Выберите класс'),
                    classes.map(cls =>
                        React.createElement('option', { key: cls.id, value: cls.id }, `${cls.numberOfInstitution} ${cls.letterDesignation}`)
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement('input', {
                    type: 'email',
                    id: 'email',
                    name: 'email',
                    value: formData.email,
                    onChange: handleChange,
                    placeholder: 'Почта',
                    required: true
                })
            ),
            React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement(
                    'select',
                    {
                        id: 'role',
                        name: 'role',
                        value: formData.role,
                        onChange: handleChange,
                        required: true
                    },
                    React.createElement('option', { value: '', disabled: true }, 'Выберите роль'),
                    Object.keys(roleMapping).map(roleName =>
                        React.createElement('option', { key: roleMapping[roleName], value: roleName }, roleName)
                    )
                )
            ),
            React.createElement(
                'button',
                { type: 'submit', className: 'single-user-submit-button' },
                'Зарегистрировать'
            ),
            showSuccessToast && React.createElement('p', {}, 'Пользователь успешно зарегистрирован!'),
            errorMessage && React.createElement('p', { style: { color: 'red' } }, errorMessage)
        );
    }

    if (selectedForm === 'multipleStudents' || selectedForm === 'multipleUsers') {
        return React.createElement(
            'form',
            { className: 'registration-form', onSubmit: handleMultipleRegistration },
            React.createElement('h2', { className: 'form-title' }, selectedForm === 'multipleStudents' ? 'Регистрация нескольких учеников' : 'Регистрация нескольких пользователей'),
            selectedForm === 'multipleStudents' && React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement(
                    'select',
                    {
                        id: 'class',
                        name: 'class',
                        value: selectedClass || '',
                        onChange: (e) => setSelectedClass(e.target.value),
                        required: true
                    },
                    React.createElement('option', { value: '', disabled: true }, 'Выберите класс'),
                    classes.map(cls =>
                        React.createElement('option', { key: cls.id, value: cls.id }, `${cls.numberOfInstitution} ${cls.letterDesignation}`)
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'form-group file-input-container' },
                React.createElement('input', {
                    type: 'file',
                    className: 'file-input',
                    onChange: handleFileChange
                }),
                fileName && React.createElement('span', { className: 'file-input-display' }, `Выбранный файл: ${fileName}`)
            ),
            React.createElement(
                'div',
                { className: 'button-container' },
                React.createElement(
                    'button',
                    { type: 'submit', className: 'multiple-users-button' },
                    'Зарегистрировать'
                ),
                React.createElement(
                    'button',
                    { type: 'button', className: 'multiple-users-button template-button', onClick: () => handleDownloadTemplate(selectedForm === 'multipleStudents' ? 'Ученики' : 'Пользователи') },
                    'Выгрузить шаблон'
                )
            ),
            showSuccessToast && React.createElement('p', {}, 'Пользователи успешно зарегистрированы!'),
            showErrorToast && React.createElement('p', { style: { color: 'red' } }, errorMessage)
        );
    }

    return null;
};

export default AdminRegistrationForm;
