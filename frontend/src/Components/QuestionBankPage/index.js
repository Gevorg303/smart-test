import React, { useState, useEffect } from 'react';
import { Form, Button, Toast, ToastContainer } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import BankCard from "../BankCard";
import "./styles.css"; // Импортируем стили
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";
import CreateQuestionPage from "../CreateQuestionPage";
import CreateTestPage from "../CreateTestPage";
import CreateSubjectPage from "../CreateSubjectPage";
import CreateThemePage from "../CreateThemePage";
import CreateIndicatorPage from "../CreateIndicatorPage";
import CreateStudentPage from "../CreateStudentPage"; // Импортируем новый компонент
import Sorting from "../Sorting";
import FilterDropdowns from "../FilterDropdowns"; // Импортируем новый компонент для фильтров
import { useOutletContext } from 'react-router-dom';

const QuestionBankPage = ({ type }) => {
    const [editItem, setEditItem] = useState(null);
    const [originalBankItems, setOriginalBankItems] = useState([]);
    const [filteredBankItems, setFilteredBankItems] = useState([]);
    const [createModal, setCreateModal] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastText, setToastText] = useState("");
    const [topText, setTopText] = useOutletContext();
    const [filters, setFilters] = useState({ class: '', role: '' });
    const navigate = useNavigate();

    // Объект для сопоставления числовых значений ролей с их строковыми представлениями
    const roleMapping = {
        3: 'Ученик',
        2: 'Учитель',
        1: 'Администратор',
        // Добавьте другие роли по необходимости
    };

    const handleCreate = (message) => {
        setShowCreateModal(false);
        setShowToast(true);
        setToastText(message);
    };

    const EditFunc = (item) => {
        setEditItem(item);
        setShowEditModal(true);
    };

    const fetchData = async (url, method = 'GET', body = null) => {
        try {
            console.log(`Sending ${method} request to ${url} with body:`, body); // Логирование запроса
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: body ? JSON.stringify(body) : null,
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error('Ошибка сети');
            }
            const data = await response.json();
            console.log(`Received response from ${url}:`, data); // Логирование ответа
            return data;
        } catch (error) {
            console.error('Ошибка получения данных:', error);
            throw error;
        }
    };

    const fetchTests = async () => {
        try {
            document.cookie = "sub=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
            document.cookie = "test=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;";

            const user = await fetchData('http://localhost:8080/users/current');
            console.log('Current user:', user); // Проверка текущего пользователя

            switch (type) {
                case "test":
                    localStorage.setItem('info', "На этой странице можно отсортировать все тесты по предмету, теме, типу теста и просмотреть");
                    setTopText("Банк тестов");
                    setCreateModal(<CreateTestPage editItem={editItem} onCreate={handleCreate} />);
                    const tests = await fetchData('http://localhost:8080/test/get-user-tests', 'POST', user);
                    console.log('Fetched tests:', tests); // Логирование данных
                    setOriginalBankItems(tests);
                    setFilteredBankItems(tests);
                    break;
                case "task":
                    localStorage.setItem('info', "На этой странице можно отсортировать все задания по предмету, теме, индикатору и просмотреть");
                    setTopText("Банк заданий");
                    setCreateModal(<CreateQuestionPage editItem={editItem} onCreate={handleCreate} />);
                    const questions = await fetchData('http://localhost:8080/task/get-user-tasks', 'POST', user);
                    console.log('Fetched questions:', questions); // Логирование данных
                    setOriginalBankItems(questions);
                    setFilteredBankItems(questions);
                    break;
                case "subject":
                    localStorage.setItem('info', "На этой странице можно отсортировать все предметы по классам и просмотреть");
                    setTopText("Банк предметов");
                    setCreateModal(<CreateSubjectPage editItem={editItem} onCreate={handleCreate} />);
                    const subjects = await fetchData('http://localhost:8080/subject/print-user-subject', 'POST', user);
                    console.log('Fetched subjects:', subjects); // Логирование данных
                    setOriginalBankItems(subjects);
                    setFilteredBankItems(subjects);
                    break;
                case "theme":
                    localStorage.setItem('info', "На этой странице можно отсортировать все темы по предмету и просмотреть");
                    setTopText("Банк тем");
                    setCreateModal(<CreateThemePage editItem={editItem} onCreate={handleCreate} />);
                    const themes = await fetchData('http://localhost:8080/theme/all');
                    console.log('Fetched themes:', themes); // Логирование данных
                    setOriginalBankItems(themes);
                    setFilteredBankItems(themes);
                    break;
                case "indicator":
                    localStorage.setItem('info', "На этой странице можно отсортировать все индикаторы по предмету, теме и просмотреть");
                    setTopText("Банк индикаторов");
                    setCreateModal(<CreateIndicatorPage editItem={editItem} onCreate={handleCreate} />);
                    const indicators = await fetchData('http://localhost:8080/indicator/all');
                    console.log('Fetched indicators:', indicators); // Логирование данных
                    setOriginalBankItems(indicators);
                    setFilteredBankItems(indicators);
                    break;
                case "student":
                    localStorage.setItem('info', "На этой странице посмотреть список учеников");
                    setTopText("Банк учеников");
                    setCreateModal(<CreateStudentPage editItem={editItem} onCreate={handleCreate} />);
                    const students = await fetchData('http://localhost:8080/users/all', 'GET');
                    console.log('Fetched students:', students); // Логирование данных
                    setOriginalBankItems(students);
                    setFilteredBankItems(students);
                    break;
                default:
                    console.error('Неизвестный тип:', type);
            }
        } catch (error) {
            console.error('Ошибка получения данных:', error);
        }
    };

    const applyFilters = () => {
        console.log('Applying filters:', filters); // Логирование фильтров
        const filteredItems = originalBankItems.filter(item => {
            console.log('Filtering item:', item); // Логирование каждого элемента
            const classMatch = filters.class ? item.classId === filters.class : true;
            const roleMatch = filters.role ? item.role?.role === roleMapping[filters.role] : true;
            console.log('Class match:', classMatch, 'Role match:', roleMatch); // Логирование результатов сравнения
            console.log('Item role:', item.role?.role, 'Filter role:', roleMapping[filters.role]); // Логирование значений ролей
            return classMatch && roleMatch;
        });
        console.log('Filtered items:', filteredItems); // Логирование отфильтрованных данных
        setFilteredBankItems(filteredItems);
    };

    useEffect(() => {
        fetchTests();
    }, [type, editItem]);

    useEffect(() => {
        applyFilters();
    }, [filters]);

    console.log('BankItems before rendering:', filteredBankItems); // Проверка данных перед рендерингом

    return (
        <div>
            <div className="page-container-quest">
                <div className="button-containers">
                    <FilterDropdowns onFilterChange={setFilters} />
                    <Sorting type={type} setBankItems={setFilteredBankItems} />
                    {type !== "student" && (
                        <Button variant="success" className="create-button" onClick={() => setShowCreateModal(true)}>
                            Создать
                        </Button>
                    )}
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
                    <Modal.Header closeButton />
                    <Modal.Body>
                        {createModal}
                    </Modal.Body>
                </Modal>
                {filteredBankItems.map((item, index) => (
                    <BankCard key={index} id={item.id} objectItem={item} type={type} setEditItem={EditFunc} />
                ))}
            </div>
            <ToastContainer className="p-3" position={'middle-center'} style={{ zIndex: 1 }}>
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                    <Toast.Header closeButton={false}>
                        <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                        <strong className="me-auto">Уведомление:</strong>
                    </Toast.Header>
                    <Toast.Body>{toastText}</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
};

export default QuestionBankPage;
