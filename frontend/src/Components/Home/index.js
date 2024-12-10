import React, { useState } from 'react';

const HomePage = () => {


    const validate = (value, setError) => {
        if (value.trim() === '') {
            setError('Поле не должно состоять из одних пробелов.');
            return false;
        } else {
            setError('');
            return true;
        }
    };

  /*  const handleConfirm = () => {
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
    };*/

    return (
        <div>
            <h1 id="welcome"></h1>
            <div className="container" id="subjects-container">

            </div>
            <div className="button-container">
                <button id="openModal" className="edit-button" >Добавить / Удалить предмет</button>
            </div>

        </div>
    );
};

export default HomePage;
