import React from 'react';
import '../css/styles.css';

const SuccessPage = ({ message }) => {
    return (
        <div className="container">
            <h2>Успешная Авторизация</h2>
            <p>{message}</p>
        </div>
    );
};

export default SuccessPage;
