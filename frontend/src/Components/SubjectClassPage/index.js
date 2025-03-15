import React, {useState, useEffect, useRef} from 'react';
import {Form, Button, Toast, ToastContainer} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import BankCard from "../BankCard";
import "./styles.css";
import Navbar from "../Navbar";
import Footer from "../Footer";
import {useNavigate, useOutletContext} from "react-router-dom";
import SubjectCardForClass from "../SubjectCardForClass";
import ClassModal from "../ClassModal";

const SubjectClass = () => {

    localStorage.setItem('info', "Здесь вы можете подписать классы на предметы");

    const [createModal, setCreateModal] = useState(); // компонент с модальным окном для создания объекта в банке
    const [showModal, setShowModal] = useState(false); // переменная отвенчает за отображение модального окна на экране
    const [showToast, setShowToast] = useState(false); // отображение тоста
    const [toastText, setToastText] = useState(""); // текст тоста
    const [currentSubject, setCurrentSubject] = useState();
    const [currentClasses, setCurrentClasses] = useState([]);

    const [subjects, setSubjects] = useState([]);
    const containerRef = useRef(null);
    const [topText, setTopText] = useOutletContext();


    const handleCreate = (message) => {
        setShowModal(false);
        setShowToast(true);
        setToastText(message);
    };

    useEffect(() => {
        async function fetchTests() {
            try {
                document.cookie = "sub=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
                document.cookie = "test=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
                const response1 = await fetch('http://localhost:8080/users/current', { //получить пользователя
                    credentials: "include",
                });
                if (!response1.ok) {
                    throw new Error('Ошибка сети');
                }
                const user = await response1.json();

                const response2 = await fetch('http://localhost:8080/subject/print-user-subject', {
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
                console.log(subjectsJson)
                const array = [];
                subjectsJson.forEach(subject => {
                    array.push(
                        <SubjectCardForClass key={subject.id} setCurrentSubject = {setCurrentSubject} setCurrentClasses = {setCurrentClasses} item={subject} setShowCreateModal={setShowModal} />
                    );
                });
                setSubjects(array);

                setCreateModal(<ClassModal targetSubject={currentSubject} classes={currentClasses} setClasses={setCurrentClasses}/>)
                setTopText("Класс предметов");

            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }

        fetchTests();
    }, [toastText, currentSubject,setTopText]);


    return (
        <div>
            <br/><br/><br/>
            <div>
                {/*<h1>Классы предметов</h1>*/}
                <div className="container-home-subject-class" id="subjects-container" ref={containerRef}
                     data-count={subjects.length}>
                    {subjects}
                </div>

                <Modal
                    show={showModal}
                    onHide={() => {
                        setShowModal(false);
                        setCurrentClasses([]);
                    }}
                    dialogClassName="modal-90w"
                    size="xl"
                    aria-labelledby="example-custom-modal-styling-title"
                >
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body>

                        {createModal/*showCreateModal?(!isTests? <CreateQuestionPage/>:<CreateTestPage/>):<>delete</>*/}

                    </Modal.Body>
                </Modal>


            </div>
            <ToastContainer
                className="p-3"
                position={'middle-center'}
                style={{zIndex: 1}}
            >
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                    <Toast.Header closeButton={false}>
                        <img
                            src="holder.js/20x20?text=%20"
                            className="rounded me-2"
                            alt=""
                        />
                        <strong className="me-auto">Уведомление:</strong>
                    </Toast.Header>
                    <Toast.Body>{toastText}</Toast.Body>
                </Toast>
            </ToastContainer>
            {/*<Footer/>*/}
        </div>
    )
        ;
};

export default SubjectClass;