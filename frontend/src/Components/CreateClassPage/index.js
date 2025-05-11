import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const CreateClassPage = ({ editItem, onCreate, onError }) => {
    const [numberOfInstitution, setNumberOfInstitution] = useState("");
    const [letterDesignation, setLetterDesignation] = useState("");

    useEffect(() => {
        if (editItem) {
            setNumberOfInstitution(editItem.numberOfInstitution);
            setLetterDesignation(editItem.letterDesignation);
        }
    }, [editItem]);

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
                id: editItem ? editItem.id : null
            };

            const url = editItem
                ? 'http://localhost:8080/teacherClass/update'
                : 'http://localhost:8080/teacherClass/add';
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
        } catch (error) {
            console.error('Ошибка отправки данных:', error);
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
        </div>
    );
};

export default CreateClassPage;
