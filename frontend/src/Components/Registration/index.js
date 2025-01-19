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
                <h2>{selectedOption === 'single' ? 'Регистрация' : 'Регистрация нескольких учеников'}</h2>

                {selectedOption === 'single' && (
                    <Form className="mt-4">
                        <Form.Group controlId="formLastName">
                            <Form.Control type="text" placeholder="Фамилия" />
                        </Form.Group>

                        <Form.Group controlId="formFirstName">
                            <Form.Control type="text" placeholder="Имя" />
                        </Form.Group>

                        <Form.Group controlId="formMiddleName">
                            <Form.Control type="text" placeholder="Отчество" />
                        </Form.Group>

                        <Form.Group controlId="formEducation">
                            <Form.Control as="select" placeholder="Место обучения">
                                <option value="">Выберите место обучения</option>
                                <option>Школа №1</option>
                                <option>Школа №2</option>
                                <option>Школа №3</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formClass">
                            <Form.Control as="select" placeholder="Класс">
                                <option value="">Выберите класс</option>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option>6</option>
                                <option>7</option>
                                <option>8</option>
                                <option>9</option>
                                <option>10</option>
                                <option>11</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formEmail">
                            <Form.Control type="email" placeholder="Эл. почта" />
                        </Form.Group>

                        <Button type="submit" className="custom-button">
                            Зарегистрировать
                        </Button>
                    </Form>
                )}

                {selectedOption === 'multiple' && (
                    <Form className="mt-4">
                        <Form.Group controlId="formEducation">
                            <Form.Control as="select" placeholder="Место обучения">
                                <option value="">Выберите место обучения</option>
                                <option>Школа №1</option>
                                <option>Школа №2</option>
                                <option>Школа №3</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formFile">
                            <Form.Control type="file" placeholder="Прикрепить файл" />
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
            </div>
            <Button className="mt-3 custom-button full-width-button">
                Справка
            </Button>
        </Container>
    );
};

export default RegistrationPage;
