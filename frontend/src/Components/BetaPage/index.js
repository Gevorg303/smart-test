import React, { useState, useEffect } from 'react';
import AdminNavbar from '../adminNavbar';
import AdminRegistrationForm from '../adminRegistrationForm';
import { useLocation } from 'react-router-dom';
import './style.css';

const BetaPage = () => {
    const [selectedForm, setSelectedForm] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const formType = params.get('form');
        if (formType) {
            setSelectedForm(formType);
        }
    }, [location]);

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
