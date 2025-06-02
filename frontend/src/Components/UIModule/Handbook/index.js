import React, {useEffect, useState} from 'react';
import './styles.css';
import Maskot from '../../../images/maskot_for_handbook.png'; // Импортируем изображение

const Handbook = ({isModalOpen, setIsModalOpen}) => {

    //const [isModalOpen, setIsModalOpen] = useState(false);
    //let text= "";
    const [text, setText] = useState('');


    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        setText(localStorage.getItem('info'));
    }, [isModalOpen]);




    return (
        <>
            {isModalOpen && (
                <div className="modal-hand" onClick={closeModal}>
                    <div className="modal-content-hand" onClick={e => e.stopPropagation()}>
                        <div className="text-section">
                            {/*<span className="close-button" onClick={closeModal}>&times;</span>*/}
                            <h2>Справка</h2>
                            <p>{text}</p>
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