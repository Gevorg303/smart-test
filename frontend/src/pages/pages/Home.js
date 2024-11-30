import React, { useState } from 'react';
import '../css/StylesForMain.css'; // Ваши стили
import '../css/main.css'; // Ваши стили
import '../css/main_modal.css'; // Ваши стили

const App = () => {
    const [itemName, setItemName] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [errorItemName, setErrorItemName] = useState('');
    const [errorItemDescription, setErrorItemDescription] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);
    const [subjects, setSubjects] = useState([]); // Состояние для хранения предметов

    const validate = (value, setError) => {
        if (value.trim() === '') {
            setError('Поле не должно состоять из одних пробелов.');
            return false;
        } else {
            setError('');
            return true;
        }
    };

    const handleConfirm = () => {
        if (validate(itemName, setErrorItemName) && validate(itemDescription, setErrorItemDescription)) {
            console.log('Данные подтверждены:', { itemName, itemDescription });
            setSubjects([...subjects, { name: itemName, description: itemDescription }]); // Добавляем предмет в список
            setItemName('');
            setItemDescription('');
            setModalOpen(false);
        }
    };

    const handleModalClick = (e) => {
        if (e.target.id === 'myModal') {
            setModalOpen(false);
        }
    };

    return (
        <div>
            <h1 id="welcome"></h1>
            <div className="container" id="subjects-container">
                {subjects.length === 0 ? (
                    <p>Предметы отсутствуют</p>
                ) : (
                    subjects.map((subject, index) => (
                        <div key={index} className="subject-item">
                            <h3>{subject.name}</h3>
                            <p>{subject.description}</p>
                        </div>
                    ))
                )}
            </div>
            <div className="button-container">
                <button id="openModal" className="edit-button" onClick={() => setModalOpen(true)}>Добавить / Удалить предмет</button>
            </div>

            {isModalOpen && (
                <div id="myModal" className="modal" style={{ display: 'flex' }} onClick={handleModalClick}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Выберите действие и введите данные:</h2>
                        <label>
                            <input type="radio" name="action" value="add" defaultChecked /> Добавить предмет
                        </label>
                        <label>
                            <input type="radio" name="action" value="delete" /> Удалить предмет
                        </label>

                        <br />
                        <label id="labelitemName" htmlFor="itemName">Название предмета</label>
                        <input
                            type="text"
                            id="itemName"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            onBlur={() => validate(itemName, setErrorItemName)}
                        />
                        <span id="errorItemName" style={{ color: 'red' }}>{errorItemName}</span>
                        <br />
                        <label id="labelitemDescription" htmlFor="itemDescription">Описание предмета</label>
                        <input
                            type="text"
                            id="itemDescription"
                            value={itemDescription}
                            onChange={(e) => setItemDescription(e.target.value)}
                            onBlur={() => validate(itemDescription, setErrorItemDescription)}
                        />
                        <span id="errorItemDescription" style={{ color: 'red' }}>{errorItemDescription}</span>
                        <br />
                        <label id="labelselectClass" htmlFor="selectClass">Выберите класс</label>
                        <select id="selectClass">
                            {/* Здесь добавьте ваши классы */}
                        </select>
                        <br />
                        <label id="labelselectSubject" htmlFor="selectSubject">Выберите предмет</label>
                        <select id="selectSubject">
                            {/* Здесь добавьте ваши предметы */}
                        </select>
                        <br />
                        <button id="confirmAction" disabled={!itemName || !itemDescription} onClick={handleConfirm}>Подтвердить</button>
                    </div>
                </div>
            )}

            <footer>
                <p>&copy; Информация о сайте</p>
            </footer>
        </div>
    );
};

export default App;
