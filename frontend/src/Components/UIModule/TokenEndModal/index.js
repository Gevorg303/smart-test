import React from 'react';
import Modal from 'react-bootstrap/Modal';
import {Navigate,useNavigate} from "react-router-dom";
import { Button} from 'react-bootstrap';
import './styles.css';

const TokenEndModal = () => {
    let navigate = useNavigate()
    return (
        <div className={"custom-modal-backdrop"}>
            <Modal show={true} backdrop={'static'} centered>
                <Modal.Header centered>
                    <Modal.Title>Сессия истекла</Modal.Title>
                </Modal.Header>
                <Modal.Body centered>
                   <h2> Ваша сессия закончилась, необходимо заново войти в ваш личный кабинет</h2>
                    <Button onClick={() => navigate("/")}>Выйти</Button>

                </Modal.Body>
            </Modal>
        </div>
    );
};

export default TokenEndModal;