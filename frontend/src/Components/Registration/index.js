import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css'; // Убедитесь, что путь к вашему CSS файлу правильный

const RegistrationPage = () => {
    const location = useLocation();
    const selectedOption = location.pathname.includes('multiple') ? 'multiple' : 'single';

    return (
        <Container className="container-registration">
            <div className="registration-box">
                <h2>Регистрация пользователей</h2>

                {selectedOption === 'single' && (
                    <Form className="mt-4">
                        <Form.Group controlId="formLastName">
                            <Form.Label className="custom-label">Фамилия</Form.Label>
                            <Form.Control type="text" placeholder="Введите фамилию" />
                        </Form.Group>

                        <Form.Group controlId="formFirstName">
                            <Form.Label className="custom-label">Имя</Form.Label>
                            <Form.Control type="text" placeholder="Введите имя" />
                        </Form.Group>

                        <Form.Group controlId="formMiddleName">
                            <Form.Label className="custom-label">Отчество</Form.Label>
                            <Form.Control type="text" placeholder="Введите отчество" />
                        </Form.Group>

                        <Form.Group controlId="formEducation">
                            <Form.Label className="custom-label">Место обучения</Form.Label>
                            <Form.Control as="select">
                                <option>Выберите место обучения</option>
                                <option>Школа №1</option>
                                <option>Школа №2</option>
                                <option>Школа №3</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formEmail">
                            <Form.Label className="custom-label">Эл. почта</Form.Label>
                            <Form.Control type="email" placeholder="Введите эл. почту" />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Зарегистрироваться
                        </Button>
                    </Form>
                )}

                {selectedOption === 'multiple' && (
                    <Form className="mt-4">
                        <Form.Group controlId="formEducation">
                            <Form.Label className="custom-label">Место обучения</Form.Label>
                            <Form.Control as="select">
                                <option>Выберите место обучения</option>
                                <option>Школа №1</option>
                                <option>Школа №2</option>
                                <option>Школа №3</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formFile">
                            <Form.Label className="custom-label">Прикрепить файл</Form.Label>
                            <Form.Control type="file" />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Зарегистрировать
                        </Button>
                        <Button variant="secondary" className="ml-2">
                            Выгрузить шаблон
                        </Button>
                    </Form>
                )}

                <Button variant="link" className="mt-3">
                    Справка
                </Button>
            </div>
        </Container>
    );
};

export default RegistrationPage;
