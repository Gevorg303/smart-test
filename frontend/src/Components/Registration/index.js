import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Toast } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css'; // Убедитесь, что путь к вашему CSS файлу правильный

const RegistrationPage = () => {
    const location = useLocation();
    const selectedOption = location.pathname.includes('multiple') ? 'multiple' : 'single';
    const [educationalInstitutions, setEducationalInstitutions] = useState([]);
    const [selectedInstitution, setSelectedInstitution] = useState(null);
    const [classes, setClasses] = useState([]);
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
                const text = await response.text(); // Получите текст ответа для диагностики
                const data = JSON.parse(text); // Парсинг JSON
                console.log('Полученные учебные заведения:', data); // Логирование полученных данных
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
            console.error('Учебное заведение не выбрано');
            return;
        }

        try {
            console.log('Отправляемые данные:', institution); // Логирование отправляемых данных
            const response = await fetch('http://localhost:8080/student-class/find-class-by-educational-institution', {
                method: 'POST', // Используем POST, так как сервер ожидает данные в теле запроса
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(institution),
            });
            if (!response.ok) {
                const errorText = await response.text(); // Получите текст ответа для диагностики
                throw new Error(`Ошибка получения данных о классах: ${errorText}`);
            }
            const data = await response.json();
            console.log('Полученные классы:', data); // Логирование полученных данных
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

        // Логирование данных из формы
        console.log('Данные из формы:', data);

        // Проверка заполненности всех полей
        if (!data.lastName || !data.firstName || !data.middleName || !data.education || !data.class || !data.email) {
            console.error('Все поля должны быть заполнены');
            return;
        }

        // Добавление educationalInstitution в данные
        const educationalInstitution = educationalInstitutions.find(inst => inst.id === parseInt(data.education));
        if (!educationalInstitution) {
            console.error('Учебное заведение не найдено');
            return;
        }
        data.educationalInstitution = educationalInstitution;

        // Логирование данных перед отправкой
        console.log('Данные для отправки:', data);

        // Дополнительная проверка данных
        if (!isValidEmail(data.email)) {
            console.error('Некорректный формат электронной почты');
            return;
        }

        // Создание объекта с данными пользователя
        const userRequest = {
            user: {
                surname: data.lastName,
                name: data.firstName,
                patronymic: data.middleName,
                role: { id: 3 }, // Роль по умолчанию
                email: data.email
            },
            educationalInstitution: data.educationalInstitution,
            studentClass: { id: parseInt(data.class, 10) }
        };

        // Создание массива с данными пользователя
        const userRequestList = [userRequest];

        // Логирование данных перед отправкой на сервер
        console.log('Данные для отправки на сервер:', userRequestList);

        try {
            const response = await fetch('http://localhost:8080/users/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userRequestList), // Отправка массива с данными пользователя
            });

            if (response.ok) {
                setRegistrationSuccess(true);
                // Очистка формы после успешной регистрации
                form.reset();
                // Обновление списка пользователей
                await fetchUsers();
                // Логирование всех пользователей
                console.log('Все пользователи после регистрации:', users);
            } else {
                const errorText = await response.text(); // Получите текст ответа для диагностики
                console.error('Ошибка регистрации пользователя:', errorText);
            }
        } catch (error) {
            console.error('Ошибка регистрации пользователя:', error);
        }
    };

    const handleMultipleRegistration = async () => {
        if (!file) {
            console.error('Файл не выбран');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // Логирование данных из файла
            console.log('Данные из файла:', jsonData);

            const userRequests = jsonData.slice(1).map(row => {
                const [lastName, firstName, middleName, email, className] = row;
                const educationalInstitution = educationalInstitutions.find(inst => inst.nameOfTheInstitution === selectedInstitution.nameOfTheInstitution);
                if (!educationalInstitution) {
                    console.error('Учебное заведение не найдено');
                    return null;
                }

                return {
                    user: {
                        surname: lastName,
                        name: firstName,
                        patronymic: middleName,
                        role: { id: 3 }, // Роль по умолчанию
                        email: email
                    },
                    educationalInstitution: educationalInstitution,
                    studentClass: { id: parseInt(className, 10) }
                };
            }).filter(user => user !== null);

            // Логирование данных перед отправкой на сервер
            console.log('Данные для отправки на сервер:', userRequests);

            try {
                const response = await fetch('http://localhost:8080/users/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userRequests), // Отправка массива с данными пользователя
                });

                if (response.ok) {
                    setRegistrationSuccess(true);
                    // Обновление списка пользователей
                    await fetchUsers();
                    // Логирование всех пользователей
                    console.log('Все пользователи после регистрации:', users);
                } else {
                    const errorText = await response.text(); // Получите текст ответа для диагностики
                    console.error('Ошибка регистрации пользователей:', errorText);
                }
            } catch (error) {
                console.error('Ошибка регистрации пользователей:', error);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleDownloadTemplate = () => {
        const link = document.createElement('a');
        link.href = '/Ученики.xlsx'; // Путь к файлу в папке public
        link.download = 'Ученики.xlsx';
        link.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFile(file);
        setFileName(file.name);
    };

    // Функция для проверки корректности email
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
            console.log('Все пользователи:', data); // Логирование полученных данных
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
                                    console.log('Выбранное учебное заведение:', institution); // Логирование выбранного учебного заведения
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
                                    console.log('Выбранное учебное заведение:', institution); // Логирование выбранного учебного заведения
                                    setSelectedInstitution(institution);
                                }}
                            >
                                <option value="">Выберите место обучения</option>
                                {educationalInstitutions.map(institution => (
                                    <option key={institution.id} value={institution.id}>{institution.nameOfTheInstitution}</option>
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
