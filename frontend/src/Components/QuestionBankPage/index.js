import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import BankCard from "../BankCard";
import "./styles.css";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";
import CreateQuestionPage from "../CreateQuestionPage";
import CreateTestPage from "../CreateTestPage";


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

    function EditFunc(item) { //открывает модальное окно для редактирования объекта
        setEditItem(item)
        setShowEditModal(true)
    }

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

                    setTitle("Банк тестов");// задать заголовок на странице
                    setCreateModal(<CreateTestPage editItem={editItem}/>); // задать модальное окно для создания на странице

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

                    setTitle("Банк заданий"); // задать заголовок на странице
                    setCreateModal(<CreateQuestionPage/>);// задать модальное окно для создания на странице

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

                    setTitle("Банк предметов"); // задать заголовок на странице

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

            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }

        fetchTests();
    }, [type,editItem]);
    /* className="page-container-quest"*/
    return (
        <div>

            <br/><br/><br/>
            <h1>{/*isTests ? "Тесты" : "Задания"*/title}</h1>
            <div className="page-container-quest">


                <Button variant="success" className="" onClick={() => {
                    setEditItem(null);
                    setShowCreateModal(true)
                }}>Создать</Button>

                <Modal
                    show={showCreateModal||showEditModal}
                    onHide={() => {setShowCreateModal(false); setShowEditModal(false)}}
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

                {bankItems.map((item, index) => <BankCard key={index} id={item.id} objectItem={item} type={type} setEditItem={EditFunc}/>)}


            </div>
            <Footer/>
        </div>
    );
};

export default QuestionBankPage;
