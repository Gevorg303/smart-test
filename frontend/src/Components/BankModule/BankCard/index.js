import React, { useState, useEffect } from 'react';
import { Form, Button, Stack } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './style.css';
import DisplayTestCard from "../DisplayTestCard";
import DisplayTaskCard from "../DisplayTaskCard";
import DisplaySubjectCard from "../DisplaySubjectCard";
import DisplayThemeCard from "../DisplayThemeCard";
import DisplayIndicatorCard from "../DisplayIndicatorCard";
import DisplayStudentCard from "../DisplayStudentCard";
import DisplayClassCard from "../DisplayClassCard";
import Modal from 'react-bootstrap/Modal';

const BankCard = ({ id, objectItem, type, setEditItem, notification}) => {
    const [item, setItem] = useState();
    const [deleteUrl, setDeleteUrlText] = useState()
    const [deleteTitle, setDeleteTitle] = useState()
    const [deleteText, setDeleteText] = useState()
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleDelete = async (event) => {
        try {
            console.log("Попытка удалить объект с id: " + id + " и типом: " + type);
            let url;
            switch (type) {
                case "test":
                    url = process.env.REACT_APP_SERVER_URL+'test/delete';
                    setDeleteTitle("Вы действительно хотите удалить тест?")
                    setDeleteText("При удалении теста также удалятся задания, принаджежащие данному тесту");
                    break;
                case "task":
                    url = process.env.REACT_APP_SERVER_URL+'task/delete';
                    setDeleteTitle("Вы действительно хотите удалить задание?")
                    setDeleteText("");
                    break;
                case "indicator":
                    url = process.env.REACT_APP_SERVER_URL+'indicator/delete';
                    setDeleteTitle("Вы действительно хотите удалить индикатор?")
                    setDeleteText("При удалении индикатора также удалятся задания в которых этот индикатор единственный.");
                    break;
                case "theme":
                    url = process.env.REACT_APP_SERVER_URL+'theme/delete';
                    setDeleteTitle("Вы действительно хотите удалить тему?")
                    setDeleteText("При удалении темы также удалятся индикаторы, задания и тесты, принаджежащие данной теме");
                    break;
                case "subject":
                    url = process.env.REACT_APP_SERVER_URL+'subject/delete';
                    setDeleteTitle("Вы действительно хотите удалить предмет?")
                    setDeleteText("При удалении предмета также удалятся темы, индикаторы, задания и  тесты, принаджежащие данному предмету");
                    break;
                case "student":
                    url = process.env.REACT_APP_SERVER_URL+'users/delete';
                    setDeleteTitle("Вы действительно хотите удалить данного пользователя?")
                    setDeleteText("");
                    break;
                case "class":
                    url = process.env.REACT_APP_SERVER_URL+'student-class/delete';
                    setDeleteTitle("Вы действительно хотите удалить класс учеников?")
                    setDeleteText("");
                    break;
                default:
                    throw new Error("Неизвестный тип");
            }
            setDeleteUrlText(url)
            setShow(true)
            console.log("Отправка запроса на URL: " + url + " с id: " + id);

        } catch (error) {
            console.error('Ошибка удаления данных:', error);
        }
    };
    const handleEdit =  (event) => {
        try {
            console.log("Редактировать: " + id + " (" + type + ")");
            setEditItem(objectItem);
        } catch (error) {
            console.error('Ошибка редактирования данных:', error);
        }
    };

    const deleteEntity = async (event) => {
        try {
            const response = await fetch(deleteUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({ id: id })
            });

            if (!response.ok) {
                throw new Error("Ошибка удаления объекта");
            }
            console.log("Объект успешно удалён");
           // window.location.reload();
        } catch (error) {
            console.error('Ошибка удаления данных:', error);
        }
        handleClose();
        notification("Успешно удалено")

    };

    useEffect(() => {
        async function fetchQuestions() {
            switch (type) {
                case "test":
                    setItem(<DisplayTestCard objectItem={objectItem} />);
                    break;
                case "task":
                    setItem(<DisplayTaskCard objectItem={objectItem} />);
                    break;
                case "subject":
                    setItem(<DisplaySubjectCard objectItem={objectItem} />);
                    break;
                case "theme":
                    setItem(<DisplayThemeCard objectItem={objectItem} />);
                    break;
                case "indicator":
                    setItem(<DisplayIndicatorCard objectItem={objectItem} />);
                    break;
                case "student":
                    setItem(<DisplayStudentCard objectItem={objectItem} />);
                    break;
                case "class":
                    setItem(<DisplayClassCard objectItem={objectItem} />);
                    break;
                default:
                    setItem(<></>);
                    break;
            }

        }

        fetchQuestions();
    }, [objectItem, type]);

    return (
        <div className="bankcard">
            <Stack direction="horizontal" gap={2}>
                <Stack direction="vertical" gap={2}>
                    {item}
                </Stack>
                <Stack direction="vertical" gap={2}>
                    <div className="btn-right">
                        {type !== "class" && (
                            <Button className={"bankbutton"} variant="danger" onClick={() => handleDelete()}>
                                <i className="bi bi-trash-fill"></i>
                            </Button>
                        )}
                        <Button className={"bankbutton"} variant="warning" onClick={() => handleEdit()}>
                            <i className="bi bi-pencil-fill"></i>
                        </Button>
                    </div>
                </Stack>
            </Stack>
            <Modal centered={true} show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{deleteTitle}</Modal.Title>
                </Modal.Header>
                {deleteText !== "" ?
                    <Modal.Body>{deleteText}</Modal.Body>
                    :
                    <></>
                }

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Отмена
                    </Button>
                    <Button variant="danger" onClick={deleteEntity}>
                        Удалить
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default BankCard;
