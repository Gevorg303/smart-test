import React from 'react';
import Modal from 'react-bootstrap/Modal';
import {Navigate,useNavigate} from "react-router-dom";
import { Button} from 'react-bootstrap';
import './styles.css';

const TokenEndModal = () => {
    let navigate = useNavigate()
    return (
        <div className={"custom-modal-backdrop"}>
            <Modal show={true} backdrop={false} centered>
                <Modal.Header centered>
                    <Modal.Title>Сессия истекла</Modal.Title>
                </Modal.Header>
                <Modal.Body centered>
                   <h2> Ваша сессия закончилась, необходимо заново войти в ваш личный кабинет</h2>
                    <Button onClick={() => {
                        document.cookie = "accessToken=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
                        document.cookie = "refreshToken=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
                        navigate("/")}
                    }>Выйти</Button>

                </Modal.Body>
            </Modal>
        </div>
    );
};

export default TokenEndModal;