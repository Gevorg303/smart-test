import React, { useState, useEffect } from 'react';
import { Form, Button, Toast, ToastContainer } from 'react-bootstrap';

const CreateStudentPage = ({ editItem, onCreate, onError}) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [login, setLogin] = useState("");
    const [patronymic, setPatronymic] = useState("");

    useEffect(() => {
        if (editItem) {
            setName(editItem.name);
            setEmail(editItem.email);
            setRole(editItem.role);
            setLogin(editItem.login);
            setPatronymic(editItem.patronymic);
        }
    }, [editItem]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const errors = [];

        // Проверка полей
        if (!name) {
            errors.push('Имя не может быть пустым.');
        }
        if (!email) {
            errors.push('Email не может быть пустым.');
        }
        if (!role) {
            errors.push('Роль не может быть пустой.');
        }
        if (!login) {
            errors.push('Логин не может быть пустым.');
        }
        if (!patronymic) {
            errors.push('Отчество не может быть пустым.');
        }

        if (errors.length > 0) {
            onError(errors);
            console.error('Ошибки валидации:', errors.join(', '));
            return;
        }

        try {
            let toastText;
            const requestBody = {
                name,
                email,
                role,
                login,
                patronymic,
                id: editItem ? editItem.id : null
            };

            const url = editItem
                ? 'http://localhost:8080/users/update'
                : 'http://localhost:8080/users/add';
            const method = editItem ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                toastText = editItem ? "Ошибка редактирования ученика" : "Ошибка создания ученика";
                throw new Error();
            }

            toastText = editItem ? "Ученик успешно отредактирован." : "Ученик успешно создан.";
            onCreate(toastText);
        } catch (error) {
            console.error('Ошибка отправки данных:', error);
        }
    };

    return (
        <div>
            <h1>{editItem ? "Редактирование ученика" : "Создание ученика"}</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Имя</Form.Label>
                    <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Роль</Form.Label>
                    <Form.Control
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Логин</Form.Label>
                    <Form.Control
                        type="text"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Отчество</Form.Label>
                    <Form.Control
                        type="text"
                        value={patronymic}
                        onChange={(e) => setPatronymic(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    {editItem ? "Редактировать" : "Создать"}
                </Button>
            </Form>
        </div>
    );
};

export default CreateStudentPage;
