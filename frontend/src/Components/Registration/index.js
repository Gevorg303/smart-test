import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "./styles.css";

class RegistrationPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            role: '',
            surname: '',
            name: '',
            patronymic: '',
            email: '',
            educationLevel: '',
            classNumber: '',
            password: '',
            errorMessage: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    async handleSubmit(event) {
        event.preventDefault();

        const { role, surname, name, patronymic, email, educationLevel, classNumber, password } = this.state;
        let errorLabel = document.getElementById('errorlabel');

        console.log('Sending request with:', JSON.stringify({ role, surname, name, patronymic, email, educationLevel, classNumber, password }));
        errorLabel.innerHTML = "";
        try {
            const response = await fetch('http://localhost:8080/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({ role, surname, name, patronymic, email, educationLevel, classNumber, password })
            });

            if (response.ok) {
                const token = await response.text();
                console.log('Received token:', token);
                document.cookie = "jwtToken=" + token + "; path=/;";
                window.location.href = '/home'; // Перенаправление на другую страницу
            } else {
                const errorText = await response.text();
                console.error('Registration failed:', errorText);
                errorLabel.innerHTML = "Ошибка регистрации";
            }
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    }

    render() {
        return (
            <div className="container-registration">
                <div className="registration-box">
                    <h2>Регистрация</h2>
                    <Form id="registrationForm" onSubmit={this.handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicErrors">
                            <Form.Text id="errorlabel" className="error-text">
                                Ошибка!
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formRole">
                            <Form.Label className="custom-label">Роль</Form.Label>
                            <Form.Control as="select" name="role" value={this.state.role} onChange={this.handleChange}  required>
                                <option value="admin">Админ</option>
                                <option value="teacher">Учитель</option>
                                <option value="student">Ученик</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formSurname">
                            <Form.Label className="custom-label">Фамилия</Form.Label>
                            <Form.Control type="text" name="surname" value={this.state.surname} onChange={this.handleChange} placeholder="Фамилия" required/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label className="custom-label">Имя</Form.Label>
                            <Form.Control type="text" name="name" value={this.state.name} onChange={this.handleChange} placeholder="Имя" required/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPatronymic">
                            <Form.Label className="custom-label">Отчество</Form.Label>
                            <Form.Control type="text" name="patronymic" value={this.state.patronymic} onChange={this.handleChange} placeholder="Отчество" required/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label className="custom-label">Email</Form.Label>
                            <Form.Control type="email" name="email" value={this.state.email} onChange={this.handleChange} placeholder="Email" required/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEducationLevel">
                            <Form.Label className="custom-label">Место обучения</Form.Label>
                            <Form.Control as="select" name="educationLevel" value={this.state.educationLevel} onChange={this.handleChange} required>
                                <option value="school">Школа</option>
                                <option value="university">Университет</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formClassNumber">
                            <Form.Label className="custom-label">Класс</Form.Label>
                            <Form.Control as="select" name="classNumber" value={this.state.classNumber} onChange={this.handleChange} required>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label className="custom-label">Пароль</Form.Label>
                            <Form.Control type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Пароль" required/>
                        </Form.Group>
                        <Button type="submit">
                            Зарегистрироваться
                        </Button>
                    </Form>
                </div>
            </div>
        );
    }
}

export default RegistrationPage;
