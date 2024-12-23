import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles.css';
import logo from '../../images/Logo_1.jpg'; // Импортируем изображение

const Navbar = () => {
    return (
        <BootstrapNavbar bg="dark" variant="dark" expand="lg" fixed="top" className="custom-navbar">
            <Container>
                <BootstrapNavbar.Brand href="/home" className="navbar-logo">
                    <img
                        src={logo} // Используем импортированное изображение
                        width="40"
                        height="40"
                        className="d-inline-block align-top"
                        alt="Logo"
                    />
                </BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BootstrapNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="navbar-links me-auto">
                        <Nav.Link href="/home" className="navbar-link">Предметы</Nav.Link>
                        <Nav.Link href="/register" className="navbar-link">Зарегистрировать пользователя</Nav.Link>
                        <Nav.Link className="navbar-link">Справка</Nav.Link>
                    </Nav>
                    <Nav className="navbar-links right">
                        <Nav.Link className="navbar-link">
                            <i className="bi bi-bell"></i>
                        </Nav.Link>
                        <Nav.Link className="navbar-link">
                            <i className="bi bi-messenger"></i>
                        </Nav.Link>
                        <Nav.Link href="/profile" className="navbar-link">Личный кабинет</Nav.Link>
                    </Nav>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
};

export default Navbar;
