import React, { useState, useEffect } from 'react';
import { Form, Button, ListGroup, Modal } from 'react-bootstrap';
import './styles.css';

const CreateClassPage = ({ editItem, onCreate, onError }) => {
    const [numberOfInstitution, setNumberOfInstitution] = useState("");
    const [letterDesignation, setLetterDesignation] = useState("");
    const [classes, setClasses] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [classToDelete, setClassToDelete] = useState(null);
    const [educationalInstitutionId, setEducationalInstitutionId] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        fetchCurrentUser();
        fetchClasses();
        if (editItem) {
            setNumberOfInstitution(editItem.numberOfInstitution);
            setLetterDesignation(editItem.letterDesignation);
        }
    }, [editItem]);

    const fetchCurrentUser = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_SERVER_URL+'users/current', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Ошибка получения данных о текущем пользователе');
            }

            const user = await response.json();
            console.log('Текущий пользователь:', user); // Логирование данных текущего пользователя
            setCurrentUser(user);
            fetchEducationalInstitution(user);
        } catch (error) {
            console.error('Ошибка получения данных о текущем пользователе:', error);
        }
    };

    const fetchClasses = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_SERVER_URL+'student-class/find-all');
            if (!response.ok) {
                throw new Error('Ошибка получения данных о классах');
            }
            const data = await response.json();
            setClasses(data);
        } catch (error) {
            console.error('Ошибка получения данных:', error);
        }
    };

    const fetchEducationalInstitution = async (user) => {
        try {
            console.log('Текущий пользователь в fetchEducationalInstitution:', user); // Логирование данных текущего пользователя

            if (!user) {
                throw new Error('Текущий пользователь не определен');
            }

            const response = await fetch(process.env.REACT_APP_SERVER_URL+'users/find-educational-institution-by-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user)
            });

            console.log('Статус ответа:', response.status); // Логирование статуса ответа

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Ошибка ответа сервера:', errorText); // Логирование текста ошибки
                throw new Error('Ошибка получения данных об образовательном учреждении');
            }

            const data = await response.json();
            console.log('Полученные данные об образовательном учреждении:', data); // Логирование данных
            setEducationalInstitutionId(data.id);
        } catch (error) {
            console.error('Ошибка получения данных об образовательном учреждении:', error);
        }
    };

    const getTokenFromCookie = () => {
        const name = "accessToken=";
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
                    id: educationalInstitutionId
                },
                isDelete: false,
                id: editItem ? editItem.id : null
            };

            console.log('Отправляемые данные:', requestBody); // Логирование данных перед отправкой

            if (!educationalInstitutionId) {
                throw new Error('Ошибка: educationalInstitutionId не установлен');
            }

            const url = editItem
                ? process.env.REACT_APP_SERVER_URL+'student-class/update-class'
                : process.env.REACT_APP_SERVER_URL+'student-class/add';
            const method = editItem ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Ошибка ответа сервера:', errorText); // Логирование текста ошибки
                toastText = editItem ? "Ошибка редактирования класса" : "Ошибка создания класса";
                throw new Error(toastText);
            }

            toastText = editItem ? "Класс успешно отредактирован." : "Класс успешно создан.";
            onCreate(toastText);
            fetchClasses(); // Обновляем список классов после добавления/редактирования
        } catch (error) {
            console.error('Ошибка отправки данных:', error);
            onError([error.message]);
        }
    };

    const handleDelete = async () => {
        try {
            const token = getTokenFromCookie(); // Получаем токен из куки

            const response = await fetch(process.env.REACT_APP_SERVER_URL+'student-class/delete', {
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
                <Button variant="primary" className="custom-button-create-window" type="submit">
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
