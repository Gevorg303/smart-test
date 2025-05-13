import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Toast } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import { useOutletContext } from 'react-router-dom';

const RegistrationPage = () => {
    const location = useLocation();
    const [topText, setTopText] = useOutletContext();
    let selectedOption;
    if (location.pathname.includes('multiple')) {
        setTopText("Регистрация нескольких учеников");
        localStorage.setItem('info', "Выберите файл в формате .xlsx,.xlsm,.xls,.xltx или .xltm с данными нескольких учеников в формате: Фамилия, Имя, Отчество, Класс, Почта");
        selectedOption = 'multiple';
    } else {
        setTopText("Регистрация");
        localStorage.setItem('info', "Введите здесь данные ученика");
        selectedOption = 'single';
    }
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [users, setUsers] = useState([]);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);


    const isValidName = (name) => {
        const nameRegex = /^[a-zA-Zа-яА-ЯёЁ'-]{2,50}$/;
        return nameRegex.test(name);
    };

    useEffect(() => {
        async function fetchClasses() {
            try {
                const responseCurrent = await fetch('http://localhost:8081/users/current', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!responseCurrent.ok) {
                    throw new Error('Ошибка получения данных о классах');
                }

                const user = await responseCurrent.json();
                console.log('ntreobq gjkmpjdfnktq:', user); // Проверьте, что данные получены

                const responseAll = await fetch('http://localhost:8081/users/all', {
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

                const response = await fetch('http://localhost:8081/users/find-student-class-by-user', {
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
                console.log('Полученные классы:', data); // Проверьте, что данные получены

                if (Array.isArray(data) && data.length > 0) {
                    setClasses(data);
                } else {
                    console.error('Полученный массив классов пуст или не является массивом');
                }
            } catch (error) {
                console.error('Ошибка получения данных о классах:', error);
            }
        }

        fetchClasses();
        // fetchUsers();
    }, []);

    useEffect(() => {
        console.log('Состояние classes обновлено:', classes);
    }, [classes]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setShowErrorToast(false);
        setShowSuccessToast(false);
        if (selectedOption === 'single') {
            await handleSingleRegistration(event);
        } else if (selectedOption === 'multiple' && file) {
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
        if (!data.class) {
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
                surname: data.lastName,
                name: data.firstName,
                patronymic: data.middleName,
                role: { id: 3 },
                email: data.email
            },
            studentClass: { id: parseInt(data.class, 10) }
        };

        const userRequestList = [userRequest];

        // Проверка, зарегистрирован ли уже email
        const isEmailRegistered = users.some(user => user.email === data.email);
        if (isEmailRegistered) {
            setErrorMessage('Пользователь с такой почтой уже зарегистрирован');
            setShowErrorToast(true);
            return;
        }

        try {
            const response = await fetch('http://localhost:8081/users/add', {
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
                setSelectedClass(null); // Очистить выбранный класс
                // await fetchUsers();
                // Сгенерировать и скачать XLS файл
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
                const response = await fetch('http://localhost:8081/users/add', {
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
                    // await fetchUsers();

                    // Generate and download XLS file
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

    const handleDownloadTemplate = () => {
        const link = document.createElement('a');
        link.href = '/Ученики.xlsx';
        link.download = 'Ученики.xlsx';
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

    /* const fetchUsers = async () => {
         try {
             const response = await fetch('http://localhost:8081/users/all', {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json;charset=UTF-8'
                 },
                 body: JSON.stringify({
                     userDto: currentUser,
                     roleDto: null
                 })
             });
             if (!response.ok) {
                 throw new Error('Ошибка получения данных о пользователях');
             }
             const data = await response.json();
             console.log('Все пользователи:', data);
             setUsers(data);
         } catch (error) {
             console.error('Ошибка получения данных о пользователях:', error);
         }
     };*/

    const downloadXLS = (data, filename) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
        XLSX.writeFile(workbook, `${filename}.xlsx`);
    };

    return (
        <Container className="container-registration">
            <div className="registration-box">
                {selectedOption === 'single' && (
                    <Form className="mt-4" onSubmit={handleSubmit}>
                        <Form.Group controlId="formLastName">
                            <Form.Control type="text" name="lastName" placeholder="Фамилия" />
                        </Form.Group>

                        <Form.Group controlId="formFirstName">
                            <Form.Control type="text" name="firstName" placeholder="Имя" />
                        </Form.Group>

                        <Form.Group controlId="formMiddleName">
                            <Form.Control type="text" name="middleName" placeholder="Отчество" />
                        </Form.Group>

                        <Form.Group controlId="formClass">
                            <Form.Control
                                as="select"
                                name="class"
                                placeholder="Класс"
                                value={selectedClass || ''}
                                onChange={(e) => setSelectedClass(e.target.value)}
                            >
                                <option value="">Выберите класс</option>
                                {classes.map((cls) => (
                                    <option key={cls.id} value={cls.id}>
                                        {cls.numberOfInstitution} {cls.letterDesignation}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formEmail">
                            <Form.Control type="email" name="email" placeholder="Эл. почта" />
                        </Form.Group>

                        <Button type="submit" className="custom-button">
                            Зарегистрировать
                        </Button>
                    </Form>
                )}

                {selectedOption === 'multiple' && (
                    <Form className="mt-4" onSubmit={handleSubmit}>
                        <Form.Group controlId="formClass">
                            <Form.Control
                                as="select"
                                name="class"
                                placeholder="Класс"
                                value={selectedClass || ''}
                                onChange={(e) => setSelectedClass(e.target.value)}
                            >
                                <option value="">Выберите класс</option>
                                {classes.map((cls) => (
                                    <option key={cls.id} value={cls.id}>
                                        {cls.numberOfInstitution} {cls.letterDesignation}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formFile">
                            <Form.Control type="file" name="file" placeholder="Прикрепить файл" onChange={handleFileChange} />
                            {fileName && <div>Выбранный файл: {fileName}</div>}
                        </Form.Group>

                        <div className="button-container">
                            <Button type="submit" className="custom-button left-button">
                                Зарегистрировать
                            </Button>
                            <Button className="template-button right-button" onClick={handleDownloadTemplate}>
                                Выгрузить шаблон
                            </Button>
                        </div>
                    </Form>
                )}

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
                            <Button variant="light" onClick={() => setShowSuccessToast(false)} style={{ marginLeft: 'auto', width: 50 }}>
                                {/*&times;*/}x
                            </Button>
                        </Toast.Header>
                        <Toast.Body>Вы успешно зарегистрировали пользователя</Toast.Body>
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
                            <Button variant="light" onClick={() => setShowErrorToast(false)} style={{ marginLeft: 'auto', width: 50 }}>
                                {/*&times;*/}x
                            </Button>
                        </Toast.Header>
                        <Toast.Body>{errorMessage}</Toast.Body>
                    </Toast>
                )}
            </div>
        </Container>
    );
};

export default RegistrationPage;
