import React, { useState, useEffect } from 'react';
import {Form, Button, Toast, ToastContainer} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import BankCard from "../BankCard";
import "./styles.css";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";
import CreateQuestionPage from "../CreateQuestionPage";
import CreateTestPage from "../CreateTestPage";
import CreateSubjectPage from "../CreateSubjectPage";
import CreateThemePage from "../CreateThemePage";
import CreateIndicatorPage from "../CreateIndicatorPage";
import Sorting from "../Sorting";
import { useOutletContext } from 'react-router-dom';


const QuestionBankPage = ({type}) => {
    //type -  тип объектов для банка
  //  const [isTests, setIsTests] = useState(isTest);

    const [editItem, setEditItem] = useState(null); // объект который изменяется
    const [bankItems, setBankItems] = useState([]); // объекты которые будут отображаться в банке
    const [title, setTitle] = useState(); // заголовок банка
    const [createModal, setCreateModal] = useState(); // компонент с модальным окном для создания объекта в банке
    const [showCreateModal, setShowCreateModal] = useState(false); // переменная отвенчает за отображение модального окна на экране
    const [showEditModal, setShowEditModal] = useState(false); // переменная для отображение модального окна создания когда происходит редактирование
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false); // отображение тоста
    const [toastText, setToastText] = useState(""); // текст тоста
    const [topText, setTopText] = useOutletContext();

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

                if(type === "test") {// заполнение тестов из бд

                    localStorage.setItem('info', "На этой странице можно отсортировать все тесты по предмету, теме, типу теста и просмотреть");

                    setTopText("Банк тестов");
                    //setTitle("Банк тестов");// задать заголовок на странице
                    setCreateModal(<CreateTestPage editItem={editItem} onCreate={handleCreate}/>); // задать модальное окно для создания на странице

                    const response2 = await fetch('http://localhost:8080/test/get-user-tests', { // получить тесты пользователя
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify(user)
                    });
                    if (!response2.ok) {
                        throw new Error('Ошибка получения теста');
                    }
                    const tests = await response2.json();
                    console.log(tests)
                    setBankItems(tests)
                }
                if(type === "task") {// заполнение заданий из бд

                    localStorage.setItem('info', "На этой странице можно отсортировать все задания по предмету, теме, индикатору и просмотреть");

                    setTopText("Банк заданий");
                    //setTitle("Банк заданий"); // задать заголовок на странице
                    setCreateModal(<CreateQuestionPage editItem={editItem} onCreate={handleCreate}/>);// задать модальное окно для создания на странице

                    const response3 = await fetch('http://localhost:8080/task/get-user-tasks', { // получить задания пользователя
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify(user)
                    });
                    if (!response3.ok) {
                        throw new Error('Ошибка получения заданий');
                    }
                    const questions = await response3.json();
                    console.log(questions)
                    setBankItems(questions)
                }

                if(type === "subject") { // заполнение предметов из бд

                    localStorage.setItem('info', "На этой странице можно отсортировать все предметы по классам и просмотреть");

                    setTopText("Банк предметов");
                    //setTitle("Банк предметов"); // задать заголовок на странице
                    setCreateModal(<CreateSubjectPage editItem={editItem} onCreate={handleCreate}/>);

                    const response4 = await fetch('http://localhost:8080/subject/print-user-subject', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify(user)
                    });
                    if (!response4.ok) {
                        throw new Error('Ошибка получения предметов');
                    }
                    const subjects = await response4.json();
                    console.log(subjects)
                    setBankItems(subjects)
                }
                if(type === "theme") { // заполнение предметов из бд

                    localStorage.setItem('info', "На этой странице можно отсортировать все темы по предмету и просмотреть");

                    setTopText("Банк тем");
                    //setTitle("Банк тем"); // задать заголовок на странице
                    setCreateModal(<CreateThemePage editItem={editItem} onCreate={handleCreate}/>);

                    const response5 = await fetch('http://localhost:8080/theme/get-theme-by-id-user', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify(user)
                    });
                    if (!response5.ok) {
                        throw new Error('Ошибка получения тем');
                    }
                    const theme = await response5.json();
                    console.log(theme)
                    setBankItems(theme)
                }
                if(type === "indicator") { // заполнение предметов из бд

                    localStorage.setItem('info', "На этой странице можно отсортировать все индикаторы по предмету, теме и просмотреть");

                    setTopText("Банк индикаторов");
                    //setTitle("Банк индикаторов"); // задать заголовок на странице
                    setCreateModal(<CreateIndicatorPage editItem={editItem} onCreate={handleCreate}/>);

                    const response6 = await fetch('http://localhost:8080/indicator/indicator-by-user', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify(user)
                    });
                    if (!response6.ok) {
                        throw new Error('Ошибка получения индикаторов');
                    }
                    const indicator = await response6.json();
                    console.log(indicator)
                    setBankItems(indicator)
                }

            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }

        fetchTests();
    }, [type,editItem,toastText, setTopText]);
    /* className="page-container-quest"*/
    return (
        <div className="scrollable-container"> {/* Добавлена эта строка */}
            <div className="page-container-quest">
                <div className="button-containers">
                    <Sorting type={type} setBankItems={setBankItems} />
                    <Button variant="success" className="create-button" onClick={() => {
                        setShowCreateModal(true);
                    }}>Создать</Button>
                </div>
                <Modal
                    show={showCreateModal || showEditModal}
                    onHide={() => {
                        setShowCreateModal(false);
                        setShowEditModal(false);
                        setEditItem(null);
                    }}
                    dialogClassName="modal-90w"
                    size="xl"
                    aria-labelledby="example-custom-modal-styling-title"
                >
                    <Modal.Header closeButton></Modal.Header>
                    <Modal.Body>
                        {createModal}
                    </Modal.Body>
                </Modal>

                {bankItems.length > 0 ? (
                    bankItems.map((item, index) => (
                        <BankCard key={index} id={item.id} objectItem={item} type={type} setEditItem={EditFunc} />
                    ))
                ) : (
                    <p className="no-items-message">Нет доступных элементов</p>
                )}
            </div>
            <ToastContainer
                className="p-3"
                position={'middle-center'}
                style={{ zIndex: 1 }}
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
        </div>
);
};

            export default QuestionBankPage;
