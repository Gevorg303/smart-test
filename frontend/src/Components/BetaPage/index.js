import React from 'react';
import AdminNavbar from '../adminNavbar'; // Убедитесь, что путь правильный
import AdminRegistrationForm from '../adminRegistrationForm'; // Обновите путь, если необходимо
import './style.css'; // Импортируем стили для BetaPage


const BetaPage = () => {
    return (
        <div className="beta-page-container">
            <AdminNavbar />
            <div className="registration-container">
                <AdminRegistrationForm />
            </div>
        </div>
    );
};

export default BetaPage;
