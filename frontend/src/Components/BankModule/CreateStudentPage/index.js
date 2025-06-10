import React, { useState, useEffect } from 'react';
import { Form, Button, Toast } from 'react-bootstrap';

const RoleSelector = ({ role, setRole, roles }) => {
    return (
        <Form.Group className="mb-3">
            <Form.Label>Роль</Form.Label>
            <Form.Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
            >
                <option value="">Выберите роль</option>
                {roles.map((roleItem) => (
                    <option key={roleItem.id} value={roleItem.id}>
                        {roleItem.name}
                    </option>
                ))}
            </Form.Select>
        </Form.Group>
    );
};

const CreateStudentPage = ({ editItem, onCreate, onError }) => {
    const roleMapping = {
        'Админ': 1,
        'Учитель': 2,
        'Ученик': 3
    };

    const roles = [
        { id: 1, name: 'Админ' },
        { id: 2, name: 'Учитель' },
        { id: 3, name: 'Ученик' }
    ];

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [login, setLogin] = useState("");
    const [patronymic, setPatronymic] = useState("");
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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
                        const defaultClass = defaultClassArray[0];
                        if (defaultClass.numberOfInstitution && defaultClass.letterDesignation) {
                            const defaultClassValue = `${defaultClass.numberOfInstitution} ${defaultClass.letterDesignation}`;
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
            setRole(editItem.role.id); // Убедитесь, что editItem.role содержит корректное значение
            setLogin(editItem.login);
            setPatronymic(editItem.patronymic);
        }
    }, [editItem]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const errors = [];

        if (!name) {
            errors.push('Имя не может быть пустым.');
        }
        if (!email) {
            errors.push('Email не может быть пустым.');
        }
        if (!role) {
            errors.push('Роль не может быть пустой.');
        }
        if (!patronymic) {
            errors.push('Отчество не может быть пустым.');
        }
        if (!selectedClass && role == roleMapping['Ученик']) {
            errors.push('Класс не может быть пустым.');
        }

        if (errors.length > 0) {
            setErrorMessage(errors.join(', '));
            setShowErrorToast(true);
            return;
        }

        try {
            const selectedClassObj = classes.find(cls => `${cls.numberOfInstitution} ${cls.letterDesignation}` === selectedClass);

            const requestBody = {
                user: {
                    id: editItem ? editItem.id : null,
                    surname: surname,
                    name: name,
                    email: email,
                    login: login,
                    patronymic: patronymic,
                    roleId: Number(role),
                },
                role: {
                    id: Number(role),
                    name: roles.find(r => r.id == role)?.name
                },
                studentClass: {
                    id: selectedClassObj ? selectedClassObj.id : null,
                    numberOfInstitution: selectedClassObj ? selectedClassObj.numberOfInstitution : null,
                    letterDesignation: selectedClassObj ? selectedClassObj.letterDesignation : null
                }
            };

            console.log('Отправляемые данные:', requestBody);

            const url = editItem
                ? process.env.REACT_APP_SERVER_URL + 'users/update'
                : process.env.REACT_APP_SERVER_URL + 'users/add';
            const method = editItem ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            const responseText = await response.text();

            try {
                const responseData = responseText ? JSON.parse(responseText) : {};
                console.log('Ответ сервера:', responseData);

                if (!response.ok) {
                    throw new Error(editItem ? "Ошибка редактирования ученика" : "Ошибка создания ученика");
                }

                setShowSuccessToast(true);
                onCreate(editItem ? "Ученик успешно отредактирован." : "Ученик успешно создан.");
            } catch (error) {
                console.error('Ошибка разбора JSON:', error);
                if (response.ok) {
                    setShowSuccessToast(true);
                    onCreate(editItem ? "Ученик успешно отредактирован." : "Ученик успешно создан.");
                } else {
                    throw new Error(editItem ? "Ошибка редактирования ученика" : "Ошибка создания ученика");
                }
            }
        } catch (error) {
            console.error('Ошибка отправки данных:', error);
            setErrorMessage(error.message);
            setShowErrorToast(true);
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
                <RoleSelector role={role} setRole={setRole} roles={roles} />
                {role == roleMapping['Ученик'] && (
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
                <Button variant="primary" className="custom-button-create-window" type="submit">
                    {editItem ? "Редактировать" : "Создать"}
                </Button>
            </Form>

            <Toast
                onClose={() => setShowSuccessToast(false)}
                show={showSuccessToast}
                delay={3000}
                autohide
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 1000,
                    backgroundColor: 'green',
                    color: 'white'
                }}
            >
                <Toast.Header closeButton={false}>
                    <strong className="mr-auto">Успешно</strong>
                    <Button variant="light" onClick={() => setShowSuccessToast(false)} style={{ marginLeft: 'auto' }}>
                        &times;
                    </Button>
                </Toast.Header>
                <Toast.Body>{editItem ? "Ученик успешно отредактирован." : "Ученик успешно создан."}</Toast.Body>
            </Toast>

            <Toast
                onClose={() => setShowErrorToast(false)}
                show={showErrorToast}
                delay={3000}
                autohide
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 1000,
                    backgroundColor: 'red',
                    color: 'white'
                }}
            >
                <Toast.Header closeButton={false}>
                    <strong className="mr-auto">Ошибка</strong>
                    <Button variant="light" onClick={() => setShowErrorToast(false)} style={{ marginLeft: 'auto' }}>
                        &times;
                    </Button>
                </Toast.Header>
                <Toast.Body>{errorMessage}</Toast.Body>
            </Toast>
        </div>
    );
};

export default CreateStudentPage;
