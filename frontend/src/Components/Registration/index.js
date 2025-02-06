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

        if (!data.lastName || !data.firstName || !data.middleName || !data.education || !data.class || !data.email) {
            return;
        }

        const educationalInstitution = educationalInstitutions.find(inst => inst.id === parseInt(data.education));
        if (!educationalInstitution) {
            return;
        }
        data.educationalInstitution = educationalInstitution;

        if (!isValidEmail(data.email)) {
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
            educationalInstitution: data.educationalInstitution,
            studentClass: { id: parseInt(data.class, 10) }
        };

        const userRequestList = [userRequest];

        try {
            const response = await fetch('http://localhost:8080/users/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userRequestList),
            });

            if (response.ok) {
                setRegistrationSuccess(true);
                form.reset();
                await fetchUsers();
            }
        } catch (error) {
            console.error('Ошибка регистрации пользователя:', error);
        }
    };

    const handleMultipleRegistration = async () => {
        if (!file) {
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

            try {
                const response = await fetch('http://localhost:8080/users/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userRequests),
                });

                if (response.ok) {
                    setRegistrationSuccess(true);
                    await fetchUsers();
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
                                }}
                            >
                                <option value="">Выберите место обучения</option>
                                {educationalInstitutions.map(institution => (
                                    <option key={institution.id} value={institution.id}>{institution.nameOfTheInstitution}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formClass">
                            <Form.Control as="select" name="class" placeholder="Класс">
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
                                onChange={(e) => {
                                    const selectedClassId = parseInt(e.target.value);
                                    setSelectedClass(selectedClassId);
                                }}
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

                {registrationSuccess && (
                    <Toast
                        onClose={() => setRegistrationSuccess(false)}
                        show={registrationSuccess}
                        delay={3000}
                        autohide
                        style={{
                            position: 'fixed',
                            bottom: '20px',
                            right: '20px',
                            zIndex: 1000,
                        }}
                    >
                        <Toast.Header>
                            <strong className="mr-auto">Успешно</strong>
                        </Toast.Header>
                        <Toast.Body>Вы успешно зарегистрировали пользователя</Toast.Body>
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
