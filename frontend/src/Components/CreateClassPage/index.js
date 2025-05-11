import React, { useState, useEffect } from 'react';
import { Form, Button, ListGroup, Modal } from 'react-bootstrap';

const CreateClassPage = ({ editItem, onCreate, onError, currentUser }) => {
    const [numberOfInstitution, setNumberOfInstitution] = useState("");
    const [letterDesignation, setLetterDesignation] = useState("");
    const [classes, setClasses] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [classToDelete, setClassToDelete] = useState(null);

    useEffect(() => {
        fetchClasses();
        if (editItem) {
            setNumberOfInstitution(editItem.numberOfInstitution);
            setLetterDesignation(editItem.letterDesignation);
        }
    }, [editItem]);

    const fetchClasses = async () => {
        try {
            const response = await fetch('http://localhost:8080/student-class/find-all');
            if (!response.ok) {
                throw new Error('Ошибка получения данных о классах');
            }
            const data = await response.json();
            setClasses(data);
        } catch (error) {
            console.error('Ошибка получения данных:', error);
        }
    };

    const getTokenFromCookie = () => {
        const name = "jwtToken=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const errors = [];

        if (!numberOfInstitution) {
            errors.push('Цифра не может быть пустой.');
        }
        if (!letterDesignation) {
            errors.push('Буква не может быть пустой.');
        }

        if (errors.length > 0) {
            onError(errors);
            console.error('Ошибки валидации:', errors.join(', '));
            return;
        }

        try {
            let toastText;
            const requestBody = {
                numberOfInstitution,
                letterDesignation,
                educationalInstitution: {
                    id: 41 // Передаем объект educationalInstitution с полем id
                },
                isDelete: false,
                id: editItem ? editItem.id : null
            };

            console.log('Отправляемые данные:', requestBody); // Логирование данных перед отправкой

            const url = editItem
                ? 'http://localhost:8080/student-class/update'
                : 'http://localhost:8080/student-class/add';
            const method = editItem ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                toastText = editItem ? "Ошибка редактирования класса" : "Ошибка создания класса";
                throw new Error();
            }

            toastText = editItem ? "Класс успешно отредактирован." : "Класс успешно создан.";
            onCreate(toastText);
            fetchClasses(); // Обновляем список классов после добавления/редактирования
        } catch (error) {
            console.error('Ошибка отправки данных:', error);
        }
    };


    const handleDelete = async () => {
        try {
            const token = getTokenFromCookie(); // Получаем токен из куки

            const response = await fetch('http://localhost:8080/student-class/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${token}` // Передаем токен в заголовках
                },
                body: JSON.stringify(classToDelete)
            });

            if (!response.ok) {
                throw new Error('Ошибка удаления класса');
            }

            setShowDeleteModal(false);
            onCreate("Класс успешно удалён.");
            fetchClasses(); // Обновляем список классов после удаления
        } catch (error) {
            console.error('Ошибка удаления данных:', error);
        }
    };

    return (
        <div>
            <h1>{editItem ? "Редактирование класса" : "Создание класса"}</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Цифра</Form.Label>
                    <Form.Control
                        type="text"
                        value={numberOfInstitution}
                        onChange={(e) => setNumberOfInstitution(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Буква</Form.Label>
                    <Form.Control
                        type="text"
                        value={letterDesignation}
                        onChange={(e) => setLetterDesignation(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    {editItem ? "Редактировать" : "Создать"}
                </Button>
            </Form>
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Подтверждение удаления</Modal.Title>
                </Modal.Header>
                <Modal.Body>Вы уверены, что хотите удалить этот класс?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Отмена
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Удалить
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CreateClassPage;
