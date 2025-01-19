import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles.css';
import logo from '../../images/Logo_1.jpg'; // Импортируем изображение

const Navbar = () => {
    return (
        <BootstrapNavbar bg="dark" variant="dark" expand="lg" fixed="top" className="custom-navbar">
            <Container fluid>
                <BootstrapNavbar.Brand as={Link} to="/home" className="navbar-logo">
                    <img
                        src={logo} // Используем импортированное изображение
                        width="40"
                        height="40"
                        className="d-inline-block align-top"
                        alt="Logo"
                    />
                </BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BootstrapNavbar.Collapse id="basic-navbar-nav" className="justify-content-between">
                    <Nav className="navbar-links">
                        <Nav.Link as={Link} to="/home" className="navbar-link">Предметы</Nav.Link>
                        <NavDropdown title="Зарегистрировать пользователя" id="register-dropdown" className="navbar-link dropdown">
                            <NavDropdown.Item as={Link} to="/register/single" className="dropdown-item">Ученик</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/register/multiple" className="dropdown-item">Несколько учеников</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link as={Link} to="/bank" className="navbar-link">Банк заданий</Nav.Link>
                    </Nav>
                    <Nav className="navbar-links right">
                        <Nav.Link className="navbar-link">
                            <i className="bi bi-bell"></i>
                        </Nav.Link>
                        <Nav.Link className="navbar-link">
                            <i className="bi bi-messenger"></i>
                        </Nav.Link>
                        <Nav.Link as={Link} to="/profile" className="navbar-link">Личный кабинет</Nav.Link>
                    </Nav>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
};

export default Navbar;
