import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import './styles.css'; // Импортируем стили

const FilterDropdowns = ({ onFilterChange }) => {
    const [classes, setClasses] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedRole, setSelectedRole] = useState('');

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                console.log('Fetching classes...'); // Логирование запроса
                const response = await fetch(process.env.REACT_APP_SERVER_URL+'/users/current-user-classes', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('Ошибка получения классов');
                }
                const data = await response.json();
                console.log('Fetched classes:', data); // Логирование ответа
                if (Array.isArray(data)) {
                    setClasses(data);
                } else {
                    console.error('Неожиданная структура данных для классов:', data);
                }
            } catch (error) {
                console.error('Ошибка получения данных о классах:', error);
            }
        };

        const fetchRoles = async () => {
            try {
                console.log('Fetching roles...'); // Логирование запроса
                const response = await fetch(process.env.REACT_APP_SERVER_URL+'/role/all', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('Ошибка получения ролей');
                }
                const data = await response.json();
                console.log('Fetched roles:', data); // Логирование ответа
                if (Array.isArray(data)) {
                    setRoles(data);
                } else {
                    console.error('Неожиданная структура данных для ролей:', data);
                }
            } catch (error) {
                console.error('Ошибка получения данных о ролях:', error);
            }
        };

        fetchClasses();
        fetchRoles();
    }, []);

    const handleClassChange = (event) => {
        setSelectedClass(event.target.value);
        onFilterChange({ class: event.target.value, role: selectedRole });
    };

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
        onFilterChange({ class: selectedClass, role: event.target.value });
    };

    const resetFilters = () => {
        setSelectedClass('');
        setSelectedRole('');
        onFilterChange({ class: '', role: '' });
    };

    return (
        <div className="filter-container">
            <Form.Group controlId="classFilter" className="filter-dropdown">
                <Form.Label>Фильтр по классу</Form.Label>
                <Form.Control as="select" onChange={handleClassChange} value={selectedClass}>
                    <option value="" disabled>Выберите класс</option>
                    {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                            {`${String(cls.numberOfInstitution)} ${String(cls.letterDesignation)}`}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="roleFilter" className="filter-dropdown">
                <Form.Label>Фильтр по роли</Form.Label>
                <Form.Control as="select" onChange={handleRoleChange} value={selectedRole}>
                    <option value="" disabled>Выберите роль</option>
                    {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                            {role.role}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>
            <button onClick={resetFilters}>Сбросить фильтры</button>
        </div>
    );
};

export default FilterDropdowns;
