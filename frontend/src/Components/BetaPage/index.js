import React, { useState, useEffect } from 'react';
import AdminNavbar from '../adminNavbar';
import AdminRegistrationForm from '../adminRegistrationForm';
import { useLocation } from 'react-router-dom';
import { Container, Form, Button, Toast } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

const BetaPage = () => {
    const [selectedForm, setSelectedForm] = useState(null);
    const [topText, setTopText] = useState("");
    const [classes, setClasses] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [users, setUsers] = useState([]);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const formType = params.get('form');
        if (formType) {
            setSelectedForm(formType);
        }

        if (location.pathname.includes('multiple')) {
            setTopText("Регистрация нескольких учеников");
            localStorage.setItem('info', "Выберите файл в формате .xlsx,.xlsm,.xls,.xltx или .xltm с данными нескольких учеников в формате: Фамилия, Имя, Отчество, Класс, Почта");
        } else {
            setTopText("Регистрация");
            localStorage.setItem('info', "Введите здесь данные ученика");
        }

        fetchClasses();
        fetchRoles();
        fetchUsers();
    }, [location]);

    const fetchClasses = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_SERVER_URL+'users/current-user-classes', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Ошибка получения данных о классах');
            }

            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                setClasses(data);
            } else {
                console.error('Полученный массив классов пуст или не является массивом');
            }
        } catch (error) {
            console.error('Ошибка получения данных о классах:', error);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_SERVER_URL+'roles', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Ошибка получения данных о ролях');
            }

            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                setRoles(data);
            } else {
                console.error('Полученный массив ролей пуст или не является массивом');
            }
        } catch (error) {
            console.error('Ошибка получения данных о ролях:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setShowErrorToast(false);
        setShowSuccessToast(false);
        if (selectedForm === 'single') {
            await handleSingleRegistration(event);
        } else if (selectedForm === 'multiple' && file) {
            await handleMultipleRegistration();
        }
    };

    const handleSingleRegistration = async (event) => {
        const form = event.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const errors = [];

        if (!data.lastName || !isValidName(data.lastName)) {
            errors.push('Фамилия');
        }
        if (!data.firstName || !isValidName(data.firstName)) {
            errors.push('Имя');
        }
        if (!data.middleName || !isValidName(data.middleName)) {
            errors.push('Отчество');
        }
        if (!selectedClass) {
            errors.push('Класс');
        }
        if (!data.email || !isValidEmail(data.email)) {
            errors.push('Эл. почта');
        }
        if (!selectedRole) {
            errors.push('Роль');
        }

        if (errors.length > 0) {
            setErrorMessage(`Заполнено некорректно: ${errors.join(', ')}`);
            setShowErrorToast(true);
            return;
        }

        const userRequest = {
            user: {
                surname: data.lastName,
                name: data.firstName,
                patronymic: data.middleName,
                role: selectedRole,
                email: data.email
            },
            studentClass: selectedClass
        };

        const userRequestList = [userRequest];

        const isEmailRegistered = users.some(user => user.email === data.email);
        if (isEmailRegistered) {
            setErrorMessage('Пользователь с такой почтой уже зарегистрирован');
            setShowErrorToast(true);
            return;
        }

        try {
            const response = await fetch(process.env.REACT_APP_SERVER_URL+'users/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userRequestList),
            });

            if (response.ok) {
                const answers = await response.json();
                setShowSuccessToast(true);
                form.reset();
                setSelectedClass(null);
                setSelectedRole(null);
                await fetchUsers();
                const userDetails = answers.map((item, index) => ({
                    ФИО: `${item.surname} ${item.name} ${item.patronymic}`,
                    Логин: item.login,
                    Пароль: item.rawPassword
                }))

                downloadXLS(userDetails, 'UserDetails');
            }
        } catch (error) {
            console.error('Ошибка регистрации пользователя:', error);
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
                        role: selectedRole,
                        email: email
                    },
                    studentClass: selectedClass
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
                const response = await fetch(process.env.REACT_APP_SERVER_URL+'users/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userRequests),
                });

                if (response.ok) {
                    const answers = await response.json();
                    setShowSuccessToast(true);
                    setSelectedClass(null);
                    setSelectedRole(null);
                    await fetchUsers();

                    const userDetails = answers.map((item, index) => ({
                        ФИО: `${item.surname} ${item.name} ${item.patronymic}`,
                        Логин: item.login,
                        Пароль: item.rawPassword
                    }))
                    downloadXLS(userDetails, 'UserDetails');
                }
            } catch (error) {
                console.error('Ошибка регистрации пользователей:', error);
            }
        };
        reader.readAsArrayBuffer(file);
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

    const handleDownloadTemplate = () => {
        const link = document.createElement('a');
        link.href = '/Ученики.xlsx'; // Убедитесь, что путь к файлу корректен
        link.download = 'Ученики.xlsx';
        link.click();
    };

    const isValidName = (name) => {
        const nameRegex = /^[a-zA-Zа-яА-ЯёЁ'-]{2,50}$/;
        return nameRegex.test(name);
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_SERVER_URL+'users/all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: null }) // Запрашиваем всех пользователей
            });
            if (!response.ok) {
                throw new Error('Ошибка получения данных о пользователях');
            }
            const data = await response.json();
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

    return (
        <div className="beta-page-container">
            <AdminNavbar onFormSelect={setSelectedForm} />
            <div className="registration-container">
                <AdminRegistrationForm
                    selectedForm={selectedForm}
                    classes={classes}
                    roles={roles}
                    selectedClass={selectedClass}
                    setSelectedClass={setSelectedClass}
                    selectedRole={selectedRole}
                    setSelectedRole={setSelectedRole}
                    handleSubmit={handleSubmit}
                    handleFileChange={handleFileChange}
                    fileName={fileName}
                    handleDownloadTemplate={handleDownloadTemplate}
                    showSuccessToast={showSuccessToast}
                    setShowSuccessToast={setShowSuccessToast}
                    showErrorToast={showErrorToast}
                    setShowErrorToast={setShowErrorToast}
                    errorMessage={errorMessage}
                />
                {showSuccessToast && (
                    <Toast
                        onClose={() => setShowSuccessToast(false)}
                        show={showSuccessToast}
                        style={{
                            position: 'fixed',
                            bottom: '20px',
                            right: '20px',
                            zIndex: 1000,
                            backgroundColor: 'green',
                            color: 'white'
                        }}
                    >
                        <Toast.Header closeButton={false}>
                            <strong className="mr-auto">Успешно</strong>
                            <Button variant="light" onClick={() => setShowSuccessToast(false)} style={{ marginLeft: 'auto' }}>
                                &times;
                            </Button>
                        </Toast.Header>
                        <Toast.Body>Вы успешно зарегистрировали пользователя</Toast.Body>
                    </Toast>
                )}

                {showErrorToast && (
                    <Toast
                        onClose={() => setShowErrorToast(false)}
                        show={showErrorToast}
                        style={{
                            position: 'fixed',
                            bottom: '20px',
                            right: '20px',
                            zIndex: 1000,
                            backgroundColor: 'red',
                            color: 'white'
                        }}
                    >
                        <Toast.Header closeButton={false}>
                            <strong className="mr-auto">Ошибка</strong>
                            <Button variant="light" onClick={() => setShowErrorToast(false)} style={{ marginLeft: 'auto' }}>
                                &times;
                            </Button>
                        </Toast.Header>
                        <Toast.Body>{errorMessage}</Toast.Body>
                    </Toast>
                )}
            </div>
        </div>
    );
};

export default BetaPage;
