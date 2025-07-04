import React, { useState, useEffect } from 'react';
import { Form, Button, Toast, ToastContainer,Stack } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import BankCard from "../../Components/BankModule/BankCard";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import CreateQuestionPage from "../../Components/BankModule/CreateQuestionPage";
import CreateTestPage from "../../Components/BankModule/CreateTestPage";
import CreateSubjectPage from "../../Components/BankModule/CreateSubjectPage";
import CreateThemePage from "../../Components/BankModule/CreateThemePage";
import CreateIndicatorPage from "../../Components/BankModule/CreateIndicatorPage";
import Sorting from "../../Components/BankModule/Sorting";
import { useOutletContext } from 'react-router-dom';
import CreateStudentPage from "../../Components/BankModule/CreateStudentPage";
import CreateClassPage from "../../Components/BankModule/CreateClassPage";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const QuestionBankPage = ({ type }) => {
    const [editItem, setEditItem] = useState(null);
    const [bankItems, setBankItems] = useState([]);
    const [createModal, setCreateModal] = useState();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const navigate = useNavigate();
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessrMessage] = useState('');
    const [topText, setTopText] = useOutletContext();
    const [showSuccessToast, setShowSuccessToast] = useState(false); // используется вместе с showErrorToast!!!

    useEffect(() => {
        // Очистка topText при монтировании компонента
        setTopText("");

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

                switch (type) {
                    case "test":
                        localStorage.setItem('info', "На этой странице можно посмотреть и редактировать созданные Вами тесты, а также при необходимости отсортировать эти тесты по предмету, теме и типу теста. Также на данной странице вы можете создать новый тест.");
                        setTopText("Банк тестов");
                        setCreateModal(<CreateTestPage editItem={editItem} onCreate={handleCreate} onError={ErrorToast} />);
                        const response2 = await fetch(process.env.REACT_APP_SERVER_URL + 'test/get-user-tests', {
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
                        setBankItems(sortById(tests));
                        break;
                    case "task":
                        localStorage.setItem('info', "На этой странице можно посмотреть и редактировать созданные Вами задания, а также при необходимости отсортировать эти задания по предмету, теме и индикатору. Также на данной странице вы можете создать новое задание.");
                        setTopText("Банк заданий");
                        setCreateModal(<CreateQuestionPage editItem={editItem} onCreate={handleCreate} onError={ErrorToast} />);
                        const response3 = await fetch(process.env.REACT_APP_SERVER_URL + 'task/get-user-tasks', {
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
                        setBankItems(sortById(questions));
                        break;
                    case "subject":
                        localStorage.setItem('info', "На этой странице можно посмотреть и редактировать созданные Вами предметы. Также на данной странице вы можете создать новый предмет.");
                        setTopText("Банк предметов");
                        setCreateModal(<CreateSubjectPage editItem={editItem} onCreate={handleCreate} onError={ErrorToast} />);
                        const response4 = await fetch(process.env.REACT_APP_SERVER_URL + 'subject/print-user-subject', {
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
                        setBankItems(sortById(subjects));
                        break;
                    case "theme":
                        localStorage.setItem('info', "На этой странице можно посмотреть и редактировать созданные Вами темы, а также при необходимости отсортировать эти темы по предмету. Также на данной странице вы можете создать новую тему.");
                        setTopText("Банк тем");
                        setCreateModal(<CreateThemePage editItem={editItem} onCreate={handleCreate} onError={ErrorToast} />);
                        const response5 = await fetch(process.env.REACT_APP_SERVER_URL + 'theme/get-theme-by-id-user', {
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
                        setBankItems(sortById(theme));
                        break;
                    case "indicator":
                        localStorage.setItem('info', "На этой странице можно посмотреть и редактировать созданные Вами индикаторы, а также при необходимости отсортировать эти индикаторы по предмету и теме. Также на данной странице вы можете создать новый индикатор.");
                        setTopText("Банк индикаторов");
                        setCreateModal(<CreateIndicatorPage editItem={editItem} onCreate={handleCreate} onError={ErrorToast} />);
                        const response6 = await fetch(process.env.REACT_APP_SERVER_URL + 'indicator/indicator-by-user', {
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
                        setBankItems(sortById(indicator));
                        break;
                    case "student":
                        localStorage.setItem('info', "На этой странице посмотреть список учеников.");
                        setTopText("Банк пользователей");
                        setCreateModal(<CreateStudentPage editItem={editItem} onCreate={handleCreate} onError={ErrorToast} />);
                        const response7 = await fetch(process.env.REACT_APP_SERVER_URL + 'users/all', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json;charset=UTF-8'
                            },
                            body: JSON.stringify({
                                userDto: user,
                                roleDto: null
                            })
                        });
                        if (!response7.ok) {
                            throw new Error('Ошибка получения пользователей');
                        }
                        const students = await response7.json();
                        setBankItems(sortById(students));
                        break;
                    case "class":
                        localStorage.setItem('info', "На этой странице можно посмотреть список классов.");
                        setTopText("Банк классов");
                        setCreateModal(<CreateClassPage editItem={editItem} onCreate={handleCreate} onError={ErrorToast} />);
                        const response8 = await fetch(process.env.REACT_APP_SERVER_URL + 'users/find-student-class-by-user', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json;charset=UTF-8'
                            },
                            body: JSON.stringify(user)
                        });
                        if (!response8.ok) {
                            throw new Error('Ошибка получения классов');
                        }
                        const classes = await response8.json();
                        setBankItems(sortById(classes));
                        break;
                    default:
                        console.error('Неизвестный тип:', type);
                        break;
                }
            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }

        fetchTests();

        // Очистка topText при размонтировании компонента
        return () => {
            setTopText("");
        };
    }, [type, editItem,showSuccessToast]);

    function EditFunc(item) {
        setEditItem(item);
        setShowEditModal(true);
        console.log("edit")
    }

    const handleCreate = (message) => {
        setShowCreateModal(false);
        setShowEditModal(false);
        setShowSuccessToast(true);// выбор типа уведомления
        setShowErrorToast(true);// открытие уведомления
        setEditItem(null);
        setSuccessrMessage(message);
        console.log("create" + message)
    };

    const ErrorToast = (messages) => {
        console.log("create" + messages)
        if (Array.isArray(messages)) {
            setErrorMessage(messages.join('\n'));
        } else {
            setErrorMessage(messages);
        }
        setShowSuccessToast(false);// выбор типа уведомления
        setShowErrorToast(true);// открытие уведомления
    };

    const sortById = (items) => {
        return [...items].sort((a, b) => b.id - a.id);
    };

    return (
        <div className="scrollable-container">
            <div className="page-container-quest">
                <div className="button-containers">
                    {type !== "class" && <Sorting type={type} setBankItems={setBankItems} />}

                    <div className="button-group-2">
                        {type !== "student" && (
                            <Button variant="success" className="create-button" onClick={() => {
                                setShowCreateModal(true);
                            }}>Создать</Button>
                        )}
                    </div>

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
                        <BankCard key={index} id={item.id} objectItem={item} type={type} setEditItem={EditFunc} notification={handleCreate}/>
                    ))
                ) : (
                    <p className="no-items-message">Нет доступных элементов</p>
                )}
            </div>

            {showErrorToast  && (
                <Toast
                    onClose={() => {setShowErrorToast(false);setShowSuccessToast(false)} }
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
                        <strong className="mr-auto">Уведомление</strong>
                        <Button variant="light" onClick={() => setShowErrorToast(false)} style={{ marginLeft: 'auto', width: '15%' }}>
                            x
                        </Button>
                    </Toast.Header>
                    <Toast.Body>{showSuccessToast ? successMessage : errorMessage}</Toast.Body>
                </Toast>
            )}
        </div>
    );
};

export default QuestionBankPage;
