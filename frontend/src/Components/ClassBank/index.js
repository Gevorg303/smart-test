import React, { useState } from 'react';
import AdminNavbar from '../adminNavbar';
import './styles.css'; // Подключаем CSS файл для стилей

const ClassBank = () => {
    const [classNumber, setClassNumber] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Логика для обработки отправки формы
        console.log('Номер класса:', classNumber);
    };

    return (
        <div>
            <div className="admin-navbar-wrapper">
                <AdminNavbar />
            </div>
            <div className="class-bank-page">
                <div className="class-bank-form-wrapper">
                    <div className="class-bank-form-header">
                        Сортировка класса по цифре и букве
                    </div>
                    <form onSubmit={handleSubmit} className="class-bank-form-content">
                        <div className="class-bank-form-element">
                            <label htmlFor="classNumber">Номер класса:</label>
                            <select
                                id="classNumber"
                                value={classNumber}
                                onChange={(e) => setClassNumber(e.target.value)}
                            >
                                <option value="">Выберите класс</option>
                                {/* Добавьте сюда опции для выбора классов */}
                                <option value="1">1</option>
                                <option value="2">2</option>
                                {/* Добавьте дополнительные опции по мере необходимости */}
                            </select>
                        </div>
                        <button type="submit" className="class-bank-submit-btn">
                            Поиск
                        </button>
                    </form>
                    <button className="class-bank-create-subject-btn">
                        Создать предмет
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClassBank;
