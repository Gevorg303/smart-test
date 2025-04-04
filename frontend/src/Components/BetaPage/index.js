import React, { useState } from 'react';
import AdminNavbar from '../adminNavbar'; // Убедитесь, что путь правильный
import AdminRegistrationForm from '../adminRegistrationForm'; // Обновите путь, если необходимо
import './style.css'; // Импортируем стили для BetaPage

const BetaPage = () => {
    const [selectedForm, setSelectedForm] = useState(null);

    return (
        <div className="beta-page-container">
            <AdminNavbar onFormSelect={setSelectedForm} />
            <div className="registration-container">
                <AdminRegistrationForm selectedForm={selectedForm} />
            </div>
        </div>
    );
};

export default BetaPage;
