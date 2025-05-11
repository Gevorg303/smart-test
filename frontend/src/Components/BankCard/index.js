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

const BankCard = ({ id, objectItem, type, setEditItem }) => {
    const [item, setItem] = useState();

    const handleDelete = async (event) => {
        try {
            console.log("Попытка удалить объект с id: " + id + " и типом: " + type);
            let url;
            switch (type) {
                case "test":
                    url = 'http://localhost:8080/test/delete';
                    break;
                case "task":
                    url = 'http://localhost:8080/task/delete';
                    break;
                case "indicator":
                    url = 'http://localhost:8080/indicator/delete';
                    break;
                case "theme":
                    url = 'http://localhost:8080/theme/delete';
                    break;
                case "subject":
                    url = 'http://localhost:8080/subject/delete';
                    break;
                case "student":
                    url = 'http://localhost:8080/users/delete';
                    break;
                case "class":
                    url = 'http://localhost:8080/student-class/delete';
                    break;
                default:
                    throw new Error("Неизвестный тип");
            }

            console.log("Отправка запроса на URL: " + url + " с id: " + id);
            const response = await fetch(url, {
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
            window.location.reload();
        } catch (error) {
            console.error('Ошибка удаления данных:', error);
        }
    };


    const handleEdit = async (event) => {
        try {
            console.log("Редактировать: " + id + " (" + type + ")");
            setEditItem(objectItem);
        } catch (error) {
            console.error('Ошибка редактирования данных:', error);
        }
    };


    useEffect(() => {
        async function fetchQuestions() {
            if (type === "test") setItem(<DisplayTestCard objectItem={objectItem} />);
            if (type === "task") setItem(<DisplayTaskCard objectItem={objectItem} />);
            if (type === "subject") setItem(<DisplaySubjectCard objectItem={objectItem} />);
            if (type === "theme") setItem(<DisplayThemeCard objectItem={objectItem} />);
            if (type === "indicator") setItem(<DisplayIndicatorCard objectItem={objectItem} />);
            if (type === "student") setItem(<DisplayStudentCard objectItem={objectItem} />);
            if (type === "class") setItem(<DisplayClassCard objectItem={objectItem} />);
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
                        <Button className={"bankbutton"} variant="danger" onClick={() => handleDelete()}>
                            <i className="bi bi-trash-fill"></i>
                        </Button>
                        <Button className={"bankbutton"} variant="warning" onClick={() => handleEdit()}>
                            <i className="bi bi-pencil-fill"></i>
                        </Button>
                    </div>
                </Stack>
            </Stack>
        </div>
    );
};

export default BankCard;
