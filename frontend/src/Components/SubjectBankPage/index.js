import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router-dom";
import Footer from "../Footer";
import BankCard from "../BankCard";
import "./styles.css";

const SubjectBankPage = () => {
    const [subjects, setSubjects] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        async function fetchTests() {
            try {
                document.cookie = "sub=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
                document.cookie = "test=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
                const response1 = await fetch('http://localhost:8080/users/current', {
                    credentials: "include",
                });
                if (!response1.ok) {
                    throw new Error('Ошибка сети');
                }
                const user = await response1.json();

                const response2 = await fetch('http://localhost:8080/subject/'+user.login, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                });
                if (!response2.ok) {
                    throw new Error('Ошибка получения предметов');
                }
                const subjects = await response2.json();
                console.log(subjects)
                setSubjects(subjects)

            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }

        fetchTests();
    }, []);

    return (
        <div className="page-container-subject">


            <Button variant="success" className="" onClick={() => {
                setShowCreateModal(true)
            }}>Создать</Button>

            <Modal
                show={showCreateModal || showDeleteModal}
                onHide={() => {
                    setShowCreateModal(false);
                    setShowDeleteModal(false)
                }}
                dialogClassName="modal-90w"
                size="xl"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>

                    <h1>Создать предмет тут</h1>

                </Modal.Body>
            </Modal>
            {subjects.map((item, index) => <BankCard key={index} id={item.id} objectItem={item} type={"subject"}/>) }
        </div>
    );
};

export default SubjectBankPage;