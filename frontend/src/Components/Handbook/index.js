import React, { useState } from 'react';
import './styles.css';
import Maskot from '../../images/maskot_for_handbook.png'; // Импортируем изображение

const Handbook = ({isModalOpen, setIsModalOpen}) => {

    //const [isModalOpen, setIsModalOpen] = useState(false);


    const closeModal = () => {
        setIsModalOpen(false);
    };


    return (
        <>
            {isModalOpen && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="text-section">
                            {/*<span className="close-button" onClick={closeModal}>&times;</span>*/}
                            <h2>Справка</h2>
                            <p>Здесь хранится ваш портрет, а также информация о вас </p>
                        </div>
                        <div className="image-section">
                            <img src={Maskot} alt="Робот"/>
                        </div>
                    </div>
                    </div>
                    )}
                </>
            );
};

export default Handbook;