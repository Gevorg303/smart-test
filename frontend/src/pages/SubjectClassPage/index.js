import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Toast, ToastContainer } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import BankCard from "../../Components/BankModule/BankCard";
import "./styles.css";
import Navbar from "../../Components/UIModule/Navbar";
import Footer from "../../Components/UIModule/Footer";
import { useNavigate, useOutletContext } from "react-router-dom";
import SubjectCardForClass from "../../Components/BankModule/SubjectCardForClass";
import ClassModal from "../../Components/BankModule/ClassModal";

const SubjectClass = () => {
    localStorage.setItem('info', "Здесь вы можете подписать классы на предметы");

    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastText, setToastText] = useState("");
    const [currentSubject, setCurrentSubject] = useState();
    const [subjects, setSubjects] = useState([]);
    const containerRef = useRef(null);
    const [topText, setTopText] = useOutletContext();
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleCreate = (message) => {
        setShowModal(false);
        setShowToast(true);
        setToastText(message);
        setShowSuccessToast(true);
        setShowErrorToast(true);
    };

    const ErrorToast = (message) => {
        setErrorMessage(message);
        setShowSuccessToast(false);
        setShowErrorToast(true);
    };

    useEffect(() => {
        async function fetchTests() {
            try {
                document.cookie = "sub=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
                document.cookie = "test=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
                const response1 = await fetch(process.env.REACT_APP_SERVER_URL + 'users/current', {
                    credentials: "include",
                });
                if (!response1.ok) {
                    throw new Error('Ошибка сети');
                }
                const user = await response1.json();

                const response2 = await fetch(process.env.REACT_APP_SERVER_URL + 'subject/print-user-subject', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify(user)
                });
                if (!response2.ok) {
                    throw new Error('Ошибка вывода предметов учителя');
                }
                const subjectsJson = await response2.json();
                const array = subjectsJson.map(subject => (
                    <SubjectCardForClass key={subject.id} setCurrentSubject={setCurrentSubject} showModal={showModal} item={subject} setShowCreateModal={setShowModal} />
                ));
                setSubjects(array);
                setTopText("Подписание классов");
            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }

        fetchTests();

        // Очистка topText при размонтировании компонента
        return () => {
            setTopText("");
        };
    }, [toastText, currentSubject, setTopText, showModal]);

    return (
        <div>
            <div>
                <div className="container-home-subject-class" id="subjects-container" ref={containerRef} data-count={subjects.length}>
                    {subjects.length > 0 ? subjects : <p className="no-items-message">Нет доступных элементов</p>}
                </div>

                <Modal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    dialogClassName="modal-90w"
                    size="xl"
                    aria-labelledby="example-custom-modal-styling-title"
                >
                    <Modal.Header closeButton></Modal.Header>
                    <Modal.Body>
                        <ClassModal targetSubject={currentSubject} showModal={showModal} onCreate={handleCreate} onError={ErrorToast} />
                    </Modal.Body>
                </Modal>
            </div>
            {showErrorToast && (
                <Toast
                    onClose={() => setShowErrorToast(false)}
                    show={showErrorToast}
                    delay={3000}
                    autohide
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        zIndex: 100000,
                        backgroundColor: showSuccessToast ? 'green' : 'red',
                        color: 'white'
                    }}
                >
                    <Toast.Header closeButton={false}>
                        <strong className="mr-auto">Успешно</strong>
                        <Button variant="light" onClick={() => setShowErrorToast(false)} style={{ marginLeft: 'auto', width: '15%' }}>
                            x
                        </Button>
                    </Toast.Header>
                    <Toast.Body>{showSuccessToast ? 'Успешно' : errorMessage}</Toast.Body>
                </Toast>
            )}
        </div>
    );
};

export default SubjectClass;
