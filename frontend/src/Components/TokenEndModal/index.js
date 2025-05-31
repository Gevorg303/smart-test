import React from 'react';
import Modal from 'react-bootstrap/Modal';
import {Navigate,useNavigate} from "react-router-dom";
import { Button} from 'react-bootstrap';

const TokenEndModal = () => {
    let navigate = useNavigate()
    return (
        <Modal show={true} fullscreen={true} centered>
            <Modal.Header centered>
                <Modal.Title>Сессия истекла</Modal.Title>
            </Modal.Header>
            <Modal.Body centered>
               <h1> Ваша сессия закончилась, необходимо заново войти в ваш личный кабинет</h1>
                <Button onClick={() => navigate("/")}>Выйти</Button>

            </Modal.Body>
        </Modal>
    );
};

export default TokenEndModal;