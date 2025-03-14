import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles.css';
import Full_logo from '../../images/Full_logo.png'; // Импортируем изображение

const Navbar = ({IsTeacher,setShowHandbook}) => {
    return (!IsTeacher?
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" fixed="top" className="custom-navbar">
        <Container fluid>
            <BootstrapNavbar.Brand as={Link} to="/home" className="navbar-logo">
                <img
                    src={Full_logo} // Используем импортированное изображение
                    width="40"
                    height="40"
                    className="d-inline-block align-top"
                    alt="Logo"
                />
            </BootstrapNavbar.Brand>
            <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav"/>
            <BootstrapNavbar.Collapse id="basic-navbar-nav" className="justify-content-between">
                <Nav className="navbar-links">
                    <Nav.Link as={Link} to="/home" className="navbar-link">Предметы</Nav.Link>
                    <NavDropdown title="Банк заданий" id="bank-dropdown"
                                 className="navbar-link dropdown">
                        <NavDropdown.Item as={Link} to="/testbank" className="dropdown-item">Тесты</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/taskbank" className="dropdown-item">Задания</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/indicatorbank" className="dropdown-item">Индикаторы</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/themebank" className="dropdown-item">Темы</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/itembank" className="dropdown-item">Предметы</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link as={Link} to="/results" className="navbar-link">Результаты</Nav.Link>
                    <NavDropdown title="Регистрация пользователя" id="register-dropdown"
                                 className="navbar-link dropdown">
                        <NavDropdown.Item as={Link} to="/register/single"
                                          className="dropdown-item">Ученик</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/register/multiple" className="dropdown-item">Несколько
                            учеников</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <Nav className="navbar-links right">
                    <Nav.Link className="navbar-link" onClick={()=>{setShowHandbook(true)}}>
                        ?
                    </Nav.Link>
                    <Nav.Link as={Link} to="/profile" className="navbar-link">Личный кабинет</Nav.Link>
                </Nav>
            </BootstrapNavbar.Collapse>
        </Container>
    </BootstrapNavbar>
        :
<BootstrapNavbar bg="dark" variant="dark" expand="lg" fixed="top" className="custom-navbar">
    <Container fluid>
        <BootstrapNavbar.Brand as={Link} to="/home" className="navbar-logo">
            <img
                src={Full_logo} // Используем импортированное изображение
                width="40"
                height="40"
                className="d-inline-block align-top"
                alt="Logo"
            />
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav"/>
        <BootstrapNavbar.Collapse id="basic-navbar-nav" className="justify-content-between">
            <Nav className="navbar-links">
                <Nav.Link as={Link} to="/home" className="navbar-link">Предметы</Nav.Link>
                <Nav.Link as={Link} to="/results" className="navbar-link">Итоги</Nav.Link>
            </Nav>
            <Nav className="navbar-links right">
                <Nav.Link className="navbar-link" onClick={()=>{setShowHandbook(true)}}>
                    ?
                </Nav.Link>
                <Nav.Link as={Link} to="/profile" className="navbar-link">Личный кабинет</Nav.Link>
            </Nav>
        </BootstrapNavbar.Collapse>
    </Container>
</BootstrapNavbar>
);
};

export default Navbar;
