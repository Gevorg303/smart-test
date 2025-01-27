import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Toast } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
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
        const form = event.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('http://localhost:8080/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setRegistrationSuccess(true);
                // Очистка формы после успешной регистрации
                form.reset();
                // Обновление списка пользователей
                fetchUsers();
            } else {
                console.error('Ошибка регистрации пользователя');
            }
        } catch (error) {
            console.error('Ошибка регистрации пользователя:', error);
        }
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
                            <Form.Control type="file" name="file" placeholder="Прикрепить файл" />
                        </Form.Group>

                        <div className="button-container">
                            <Button type="submit" className="custom-button left-button">
                                Зарегистрировать
                            </Button>
                            <Button className="template-button right-button">
                                Выгрузить шаблон
                            </Button>
                        </div>
                    </Form>
                )}

                {registrationSuccess && (
                    <Toast onClose={() => setRegistrationSuccess(false)} show={registrationSuccess} delay={3000} autohide>
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
