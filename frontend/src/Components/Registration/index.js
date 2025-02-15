import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Toast } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css'; // Ensure the path to your CSS file is correct

const RegistrationPage = () => {
    const location = useLocation();
    const selectedOption = location.pathname.includes('multiple') ? 'multiple' : 'single';
    const [educationalInstitutions, setEducationalInstitutions] = useState([]);
    const [selectedInstitution, setSelectedInstitution] = useState(null);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [users, setUsers] = useState([]);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    useEffect(() => {
        async function fetchEducationalInstitutions() {
            try {
                const response = await fetch('http://localhost:8080/educational-institutions/all');
                if (!response.ok) {
                    throw new Error('Ошибка получения данных об учебных заведениях');
                }
                const data = await response.json();
                setEducationalInstitutions(data);
            } catch (error) {
                console.error('Ошибка получения данных об учебных заведениях:', error);
            }
        }

        fetchEducationalInstitutions();
        fetchUsers();
    }, []);

    useEffect(() => {
        if (selectedInstitution) {
            fetchClassesByInstitution(selectedInstitution);
        } else {
            setClasses([]);
            setSelectedClass(null);
        }
    }, [selectedInstitution]);

    const fetchClassesByInstitution = async (institution) => {
        if (!institution) {
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/student-class/find-class-by-educational-institution', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(institution),
            });
            if (!response.ok) {
                throw new Error('Ошибка получения данных о классах');
            }
            const data = await response.json();
            setClasses(data);
        } catch (error) {
            console.error('Ошибка получения данных о классах:', error);
        }
    };

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

        if (!data.lastName) {
            errors.push('Фамилия');
        }
        if (!data.firstName) {
            errors.push('Имя');
        }
        if (!data.middleName) {
            errors.push('Отчество');
        }
        if (!data.education) {
            errors.push('Место обучения');
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

        const educationalInstitution = educationalInstitutions.find(inst => inst.id === parseInt(data.education));
        if (!educationalInstitution) {
            setErrorMessage('Место обучения не найдено');
            setShowErrorToast(true);
            return;
        }
        data.educationalInstitution = educationalInstitution;

        const userRequest = {
            user: {
                surname: data.lastName,
                name: data.firstName,
                patronymic: data.middleName,
                role: { id: 3 },
                email: data.email
            },
            educationalInstitution: data.educationalInstitution,
            studentClass: { id: parseInt(data.class, 10) }
        };

        const userRequestList = [userRequest];

        // Check if the email is already registered
        const isEmailRegistered = users.some(user => user.email === data.email);
        if (isEmailRegistered) {
            setErrorMessage('Пользователь с такой почтой уже зарегистрирован');
            setShowErrorToast(true);
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/users/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userRequestList),
            });

            if (response.ok) {
                setShowSuccessToast(true);
                form.reset();
                setSelectedClass(null); // Clear selected class
                await fetchUsers();

                // Generate and download XLS file
                const userDetails = [
                    {
                        'ФИО': `${data.lastName} ${data.firstName} ${data.middleName}`,
                        'Логин': data.login,
                        'Пароль': data.password // Replace with actual password logic
                    }
                ];
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

            const userRequests = jsonData.slice(1).map(row => {
                const [lastName, firstName, middleName, email] = row;
                const educationalInstitution = educationalInstitutions.find(inst => inst.nameOfTheInstitution === selectedInstitution.nameOfTheInstitution);
                if (!educationalInstitution) {
                    return null;
                }

                const errors = [];
                if (!lastName) {
                    errors.push('Фамилия');
                }
                if (!firstName) {
                    errors.push('Имя');
                }
                if (!middleName) {
                    errors.push('Отчество');
                }
                if (!email || !isValidEmail(email)) {
                    errors.push('Эл. почта');
                }

                if (errors.length > 0) {
                    setErrorMessage(`Заполнено некорректно: ${errors.join(', ')}`);
                    setShowErrorToast(true);
                    return null;
                }

                // Check if the email is already registered
                const isEmailRegistered = users.some(user => user.email === email);
                if (isEmailRegistered) {
                    setErrorMessage(`Пользователь с почтой ${email} уже зарегистрирован`);
                    setShowErrorToast(true);
                    return null;
                }

                return {
                    user: {
                        surname: lastName,
                        name: firstName,
                        patronymic: middleName,
                        role: { id: 3 },
                        email: email
                    },
                    educationalInstitution: educationalInstitution,
                    studentClass: { id: parseInt(selectedClass, 10) }
                };
            }).filter(user => user !== null);

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
                    setShowSuccessToast(true);
                    setSelectedClass(null); // Clear selected class
                    await fetchUsers();

                    // Generate and download XLS file
                    const userDetails = userRequests.map(user => ({
                        'ФИО': `${user.user.surname} ${user.user.name} ${user.user.patronymic}`,
                        'Логин': data.user.login,
                        'Пароль': user.user.password  // Replace with actual password logic
                    }));
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
        setFile(file);
        setFileName(file.name);
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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

    return (
        <Container className="container-registration">
            <div className="registration-box">
                <h2>{selectedOption === 'single' ? 'Регистрация' : 'Регистрация нескольких учеников'}</h2>

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

                        <Form.Group controlId="formEducation">
                            <Form.Control
                                as="select"
                                name="education"
                                placeholder="Место обучения"
                                onChange={(e) => {
                                    const institution = educationalInstitutions.find(inst => inst.id === parseInt(e.target.value));
                                    setSelectedInstitution(institution);
                                    setSelectedClass(null); // Clear selected class
                                }}
                            >
                                <option value="">Выберите место обучения</option>
                                {educationalInstitutions.map(institution => (
                                    <option key={institution.id} value={institution.id}>{institution.nameOfTheInstitution}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formClass">
                            <Form.Control as="select" name="class" placeholder="Класс" value={selectedClass || ''} onChange={(e) => setSelectedClass(e.target.value)}>
                                <option value="">Выберите класс</option>
                                {classes.map(cls => (
                                    <option key={cls.id} value={cls.id}>{cls.numberOfInstitution} {cls.letterDesignation}</option>
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
                        <Form.Group controlId="formEducation">
                            <Form.Control
                                as="select"
                                name="education"
                                placeholder="Место обучения"
                                onChange={(e) => {
                                    const institution = educationalInstitutions.find(inst => inst.id === parseInt(e.target.value));
                                    setSelectedInstitution(institution);
                                    setSelectedClass(null); // Clear selected class
                                }}
                            >
                                <option value="">Выберите место обучения</option>
                                {educationalInstitutions.map(institution => (
                                    <option key={institution.id} value={institution.id}>{institution.nameOfTheInstitution}</option>
                                ))}
                            </Form.Control>
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
                                {classes.map(cls => (
                                    <option key={cls.id} value={cls.id}>{cls.numberOfInstitution} {cls.letterDesignation}</option>
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
            <Button className="mt-3 custom-button full-width-button">
                Справка
            </Button>
        </Container>
    );
};

export default RegistrationPage;