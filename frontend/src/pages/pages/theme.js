import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/StylesForTheme.css'; // Настройте путь к вашим стилям
import './styles/theme_modal.css'; // Настройте путь к вашим стилям
import 'font-awesome/css/font-awesome.min.css'; // Убедитесь, что у вас есть этот пакет

const App = () => {
    return (
        <div>
            <NavBar />
            <MainContent />
            <Footer />
        </div>
    );
};

const MainContent = () => {
    const [itemName, setItemName] = useState('');
    const [action, setAction] = useState('add');
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e) => {
        const value = e.target.value;
        setItemName(value);
        if (value.trim() === '') {
            setErrorMessage('Поле не должно состоять из одних пробелов.');
        } else {
            setErrorMessage('');
        }
    };

    const isConfirmDisabled = errorMessage !== '';

    return (
        <div>
            <h1>Темы по предмету</h1>
            <h1 id="titlesubject"></h1>
            <div className="flex-col align-center mb-95">
                <div className="container" id="subjects-container"></div>
                <button className="edit-button" data-toggle="modal" data-target="#myModal">Добавить / Удалить тему</button>
            </div>

            <Modal
                itemName={itemName}
                onItemNameChange={handleInputChange}
                errorMessage={errorMessage}
                action={action}
                setAction={setAction}
                isConfirmDisabled={isConfirmDisabled}
            />
        </div>
    );
};

const Modal = ({ itemName, onItemNameChange, errorMessage, action, setAction, isConfirmDisabled }) => {
    return (
        <div className="modal" id="myModal">
            <div className="modal-content">
                <h2>Выберите действие и введите название темы:</h2>
                <label>
                    <input
                        type="radio"
                        name="action"
                        value="add"
                        checked={action === 'add'}
                        onChange={() => setAction('add')}
                    /> Добавить тему
                </label>
                <label>
                    <input
                        type="radio"
                        name="action"
                        value="delete"
                        checked={action === 'delete'}
                        onChange={() => setAction('delete')}
                    /> Удалить тему
                </label>
                <br />
                <label htmlFor="itemName">Название темы</label>
                <input
                    type="text"
                    id="itemName"
                    value={itemName}
                    placeholder="Название темы"
                    onChange={onItemNameChange}
                />
                <div style={{ color: 'red' }}>{errorMessage}</div>
                <br />
                <label htmlFor="selectTheme">Выберите тему</label>
                <select id="selectTheme">
                    {/* Здесь нужно добавить динамическое заполнение */}
                </select>

                <br />
                <button id="confirmAction" disabled={isConfirmDisabled}>Подтвердить</button>
            </div>
        </div>
    );
};

const Footer = () => {
    return (
        <footer>
            <p>&copy; Информация о сайте</p>
        </footer>
    );
};

export default App;
