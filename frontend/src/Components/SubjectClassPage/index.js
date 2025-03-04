import React, {useState, useEffect, useRef} from 'react';
import {Form, Button, Toast, ToastContainer} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import BankCard from "../BankCard";
import "./styles.css";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";
import CreateTestPage from "../CreateTestPage";
import CreateQuestionPage from "../CreateQuestionPage";
import CreateSubjectPage from "../CreateSubjectPage";
import CreateThemePage from "../CreateThemePage";
import CreateIndicatorPage from "../CreateIndicatorPage";
import Sorting from "../Sorting";
import SubjectCard from "../SubjectCard";
import SubjectCardForClass from "../SubjectCardForClass";

const SubjectClass = () => {

    const [editItem, setEditItem] = useState(null); // объект который изменяется
    const [showEditModal, setShowEditModal] = useState(false); // переменная для отображение модального окна создания когда происходит редактирование
    const [createModal, setCreateModal] = useState(); // компонент с модальным окном для создания объекта в банке
    const [showCreateModal, setShowCreateModal] = useState(false); // переменная отвенчает за отображение модального окна на экране
    const [showToast, setShowToast] = useState(false); // отображение тоста
    const [toastText, setToastText] = useState(""); // текст тоста

    const [subjects, setSubjects] = useState([]);
    const containerRef = useRef(null);



    function EditFunc(item) { //открывает модальное окно для редактирования объекта
        setEditItem(item)
        setShowEditModal(true)
    }
    const handleCreate = (message) => {
        setShowCreateModal(false);
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
                const array = [];
                subjectsJson.forEach(subject => {
                    array.push(
                        <SubjectCardForClass key={subject.id} id={subject.id} name={subject.subjectName} description={subject.description} />
                    );
                });
                setSubjects(array);




            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }

        fetchTests();
    }, [editItem,toastText]);


    return (
        <div>
            <br/><br/><br/>
            <div>
                <h1>Классы предметов</h1>
                <div className="container-home-subject-class" id="subjects-container" ref={containerRef}
                     data-count={subjects.length}>
                    {subjects}
                </div>


                <Modal
                    show={showCreateModal || showEditModal}
                    onHide={() => {
                        setShowCreateModal(false);
                        setShowEditModal(false)
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
                <Footer/>
            </div>
            )
            ;
            };

            export default SubjectClass;