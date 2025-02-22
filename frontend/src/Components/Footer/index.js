import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles.css';

const Footer = () => {
    return (
        <footer className="footer">
            <Container>
                <Row>
                    <Col md={4} className="footer-section">
                        <h5>О компании</h5>
                        <p>Мы стремимся к совершенству в каждом проекте.</p>
                    </Col>
                    <Col md={4} className="footer-section">
                        <h5>Социальные сети</h5>
                        <ul className="list-unstyled">
                            <li>
                                <p href="#" onClick={(e) => e.preventDefault()} className="disabled-link">
                                    ВКонтакте
                                </p>
                            </li>
                            <li>
                                <p href="#" onClick={(e) => e.preventDefault()} className="disabled-link">
                                   Telegram
                                </p>
                            </li>
                        </ul>
                    </Col>
                    <Col md={4} className="footer-section">
                        <h5>Контактная информация</h5>
                        <p>Email: info@example.com</p>
                        <p>Телефон: +7 (123) 456-78-90</p>
                    </Col>
                </Row>
                <Row>
                    <Col className="text-center mt-3">
                        <p>&copy; {new Date().getFullYear()} Ваша Компания. Все права защищены.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
