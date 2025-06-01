import React, { useState, useEffect } from 'react';
import { Form, Button, Toast, ToastContainer } from 'react-bootstrap';
import './styles.css';

const CreateStudentPage = ({ editItem, onCreate, onError }) => {
    const roleMapping = {
        'Админ': 1,
        'Учитель': 2,
        'Ученик': 3
    };

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [login, setLogin] = useState("");
    const [patronymic, setPatronymic] = useState("");
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");

    useEffect(() => {
        async function fetchClasses() {
            try {
                const responseCurrent = await fetch(process.env.REACT_APP_SERVER_URL + 'users/current', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!responseCurrent.ok) {
                    throw new Error('Ошибка получения данных о текущем пользователе');
                }

                const user = await responseCurrent.json();
                console.log('Текущий пользователь:', user);

                const response = await fetch(process.env.REACT_APP_SERVER_URL + 'users/find-student-class-by-user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(user)
                });

                if (!response.ok) {
                    throw new Error('Ошибка получения данных о классах');
                }

                const data = await response.json();
                console.log('Полученные классы:', data);

                if (Array.isArray(data) && data.length > 0) {
                    setClasses(data);
                } else {
                    console.error('Полученный массив классов пуст или не является массивом');
                }
            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }

        async function fetchDefaultClass() {
            if (editItem) {
                try {
                    const response = await fetch(process.env.REACT_APP_SERVER_URL + `student-class/teacherid=${editItem.id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                    });

                    if (!response.ok) {
                        throw new Error('Ошибка получения данных о классе по умолчанию');
                    }

                    const defaultClassArray = await response.json();
                    console.log('Класс по умолчанию:', defaultClassArray);

                    if (defaultClassArray && defaultClassArray.length > 0) {
                        const defaultClass = defaultClassArray[0]; // Извлекаем первый элемент массива
                        console.log('numberOfInstitution:', defaultClass.numberOfInstitution);
                        console.log('letterDesignation:', defaultClass.letterDesignation);

                        if (defaultClass.numberOfInstitution && defaultClass.letterDesignation) {
                            const defaultClassValue = `${defaultClass.numberOfInstitution} ${defaultClass.letterDesignation}`;
                            console.log('Устанавливаем класс по умолчанию:', defaultClassValue);
                            setSelectedClass(defaultClassValue);
                        } else {
                            console.error('Класс по умолчанию не содержит ожидаемых полей numberOfInstitution и letterDesignation');
                        }
                    } else {
                        console.error('Массив классов по умолчанию пуст или не определен');
                    }
                } catch (error) {
                    console.error('Ошибка получения данных о классе по умолчанию:', error);
                }
            }
        }

        fetchClasses();
        fetchDefaultClass();

        if (editItem) {
            setName(editItem.name);
            setSurname(editItem.surname);
            setEmail(editItem.email);
            setRole(editItem.role);
            setLogin(editItem.login);
            setPatronymic(editItem.patronymic);
        }
    }, [editItem]);

    useEffect(() => {
        console.log('Current role:', role);
    }, [role]);

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
        if (!selectedClass && role == roleMapping['Ученик']) {
            errors.push('Класс не может быть пустым.');
        }

        if (errors.length > 0) {
            onError(errors);
            console.error('Ошибки валидации:', errors.join(', '));
            return;
        }

        try {
            let toastText;
            const requestBody = {
                user:{name: name,
                    email: email,
                    role: role,
                    login:login,
                    patronymic:patronymic,},
                studentClass: selectedClass,
                role:role,
               // id: editItem ? editItem.id : null
            };

            console.log('Отправляемые данные:', requestBody); // Логируем данные перед отправкой

            const url = editItem
                ? process.env.REACT_APP_SERVER_URL + 'users/update'
                : process.env.REACT_APP_SERVER_URL + 'users/add';
            const method = editItem ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify(requestBody)
            });
            const responseData = await response.json(); // Получаем данные ответа
            console.log('Ответ сервера:', responseData); // Логируем ответ сервера

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
                    <Form.Label>Фамилия</Form.Label>
                    <Form.Control
                        type="text"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
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
                    <Form.Select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="">{role.role}</option>
                        {Object.keys(roleMapping).map((roleName) => (
                            <option key={roleMapping[roleName]} value={roleMapping[roleName]}>
                                {roleName}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                {role.role ==='Ученик' && (
                    <Form.Group className="mb-3">
                        <Form.Label>Класс</Form.Label>
                        <Form.Select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                        >
                            {classes.map(cls => (
                                <option key={cls.id} value={`${cls.numberOfInstitution} ${cls.letterDesignation}`}>
                                    {`${cls.numberOfInstitution} ${cls.letterDesignation}`}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                )}
                <Form.Group className="mb-3">
                    <Form.Label>Логин</Form.Label>
                    <Form.Control
                        type="text"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" className="custom-button-create-window" type="submit">
                    {editItem ? "Редактировать" : "Создать"}
                </Button>
            </Form>
        </div>
    );
};

export default CreateStudentPage;
