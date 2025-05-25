import React, { useState, useEffect } from 'react';
import './style.css';
import * as XLSX from 'xlsx';
import { Toast, Button } from 'react-bootstrap';

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
    const [classes, setClasses] = useState([]);
    const [users, setUsers] = useState([]);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    const roleMapping = {
        'Админ': 1,
        'Учитель': 2,
        'Ученик': 3
    };

    useEffect(() => {
        async function fetchClasses() {
            try {
                const responseCurrent = await fetch(process.env.REACT_APP_SERVER_URL+'users/current', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!responseCurrent.ok) {
                    throw new Error('Ошибка получения данных о текущем пользователе');
                }

                const user = await responseCurrent.json();
                console.log('Текущий пользователь:', user);
                setCurrentUser(user);

                const responseAll = await fetch(process.env.REACT_APP_SERVER_URL+'users/all', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify({
                        userDto: user,
                        roleDto: null
                    })
                });
                if (!responseAll.ok) {
                    throw new Error('Ошибка получения данных о пользователях');
                }
                const data2 = await responseAll.json();
                console.log('Все пользователи:', data2);
                setUsers(data2);

                const response = await fetch(process.env.REACT_APP_SERVER_URL+'users/find-student-class-by-user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(user)
                });

                if (!response.ok) {
                    throw new Error('Ошибка получения данных о классах');
                }

                const data = await response.json();
                console.log('Полученные классы:', data);

                if (Array.isArray(data) && data.length > 0) {
                    setClasses(data);
                } else {
                    console.error('Полученный массив классов пуст или не является массивом');
                }
            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }

        fetchClasses();
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
        setShowSuccessToast(false);
        const form = e.target;
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
        if (data.role !== 'Админ' && data.role !== 'Учитель' && !data.class) {
            errors.push('Класс');
        }
        if (!data.email || !isValidEmail(data.email)) {
            errors.push('Эл. почта');
        }

        if (errors.length > 0) {
            setErrorMessage(`Заполнено некорректно: ${errors.join(', ')}`);
            setShowErrorToast(true);
            return;
        }

        const userRequest = {
            user: {
                surname: data.lastName || 'Фамилия',
                name: data.firstName || 'Имя',
                patronymic: data.middleName || 'Отчество',
                role: { id: roleMapping[data.role] },
                email: data.email,
                educationalInstitution: { id: currentUser?.educationalInstitution?.id || 23 }
            }
        };

        if (data.role !== 'Админ' && data.role !== 'Учитель') {
            userRequest.studentClass = { id: parseInt(data.class, 10) };
        }

        console.log('Данные для регистрации одного пользователя:', userRequest);

        try {
            const response = await fetch(process.env.REACT_APP_SERVER_URL+'users/admin/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userRequestList: [userRequest],
                    user: currentUser
                }),
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
                await fetchUsers();
                const answers = await response.json();
                setShowSuccessToast(true);
                const userDetails = answers.map((item, index) => ({
                    ФИО: `${item.surname} ${item.name} ${item.patronymic}`,
                    Логин: item.login,
                    Пароль: item.rawPassword
                }));

                downloadXLS(userDetails, 'UserDetails');
            } else {
                const errorText = await response.text();
                throw new Error(`Ошибка регистрации пользователя: ${errorText}`);
            }
        } catch (error) {
            console.error('Ошибка регистрации пользователя:', error);
            setErrorMessage(error.message);
            setShowErrorToast(true);
        }
    };


    const handleMultipleRegistration = async (e) => {
        e.preventDefault();

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
                const [lastName, firstName, middleName, email, role] = row;
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
                if (!role || !roleMapping[role]) {
                    rowErrors.push('Роль');
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

                console.log(`Роль для пользователя ${email}: ${role}`);

                const studentClass = { id: 23 };
                const educationalInstitution = { id: currentUser?.educationalInstitution?.id || 23 };

                userRequests.push({
                    user: {
                        surname: lastName || currentUser?.surname || 'Фамилия',
                        name: firstName || currentUser?.name || 'Имя',
                        patronymic: middleName || currentUser?.patronymic || 'Отчество',
                        role: { id: roleMapping[role] },
                        email: email || currentUser?.email || 'email@example.com',
                        educationalInstitution: educationalInstitution
                    },
                    studentClass: studentClass
                });
            });

            console.log('Данные для регистрации из файла:', userRequests);

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
                    await fetchUsers();

                    const userDetails = answers.map((item, index) => ({
                        ФИО: `${item.surname} ${item.name} ${item.patronymic}`,
                        Логин: item.login,
                        Пароль: item.rawPassword
                    }));
                    downloadXLS(userDetails, 'UserDetails');
                } else {
                    const errorText = await response.text();
                    throw new Error(`Ошибка регистрации пользователей: ${errorText}`);
                }
            } catch (error) {
                console.error('Ошибка регистрации пользователей:', error);
                setErrorMessage(error.message);
                setShowErrorToast(true);
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
            console.log('Fetching current user...');
            const currentUserResponse = await fetch(process.env.REACT_APP_SERVER_URL+'users/current', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!currentUserResponse.ok) {
                throw new Error('Ошибка получения данных о текущем пользователе');
            }
            const currentUser = await currentUserResponse.json();

            console.log('Fetching users...');
            const response = await fetch(process.env.REACT_APP_SERVER_URL+'users/all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userDto: currentUser,
                    roleDto: { id: roleMapping[currentUser.role] }
                })
            });
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
                {formData.role !== 'Админ' && formData.role !== 'Учитель' && (
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
                )}
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
                <button type="submit" className="single-user-submit-button">
                    Зарегистрировать
                </button>
                {showErrorToast && (
                    <Toast
                        onClose={() => setShowErrorToast(false)}
                        show={showErrorToast}
                        delay={3000}
                        autohide
                        style={{
                            position: 'fixed',
                            bottom: '20px',
                            right: '20px',
                            zIndex: 100000,
                            backgroundColor: 'red',
                            color: 'white'
                        }}
                    >
                        <Toast.Header closeButton={false}>
                            <strong className="mr-auto">Ошибка</strong>
                            <Button variant="light" onClick={() => setShowErrorToast(false)} style={{ marginLeft: 'auto', width: '15%' }}>
                                x
                            </Button>
                        </Toast.Header>
                        <Toast.Body>{errorMessage}</Toast.Body>
                    </Toast>
                )}
            </form>
        );
    }

    if (selectedForm === 'multipleStudents' || selectedForm === 'multipleUsers') {
        return (
            <form className="registration-form" onSubmit={handleMultipleRegistration}>
                <h2 className="form-title">
                    {selectedForm === 'multipleStudents' ? 'Регистрация нескольких учеников' : 'Регистрация нескольких пользователей'}
                </h2>
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
                {showSuccessToast && (
                    <Toast
                        onClose={() => setShowSuccessToast(false)}
                        show={showSuccessToast}
                        delay={3000}
                        autohide
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
                        <Toast.Body>Вы успешно зарегистрировали пользователей</Toast.Body>
                    </Toast>
                )}
                {showErrorToast && (
                    <Toast
                        onClose={() => setShowErrorToast(false)}
                        show={showErrorToast}
                        delay={3000}
                        autohide
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
            </form>
        );
    }

    return null;
};

export default AdminRegistrationForm;
