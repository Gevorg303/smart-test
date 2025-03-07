import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import './styles.css';
import Navbar from "../Navbar";
import Footer from "../Footer";

const ResultsPage = ({ userId }) => {
    const [subjects, setSubjects] = useState([]);

    localStorage.setItem('info', "Здесь вы можете увидеть вашу среднюю оценку за предмет");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setSubjects([
                    { name: "Математика", average: "4,3" },
                    { name: "Русский язык", average: "4,22" },
                    { name: "Химия", average: "4,92" },
                    { name: "Биология", average: "4" },
                    { name: "География", average: "3,6" },
                    { name: "Обществознание", average: "4,8" },
                    { name: "Информатика", average: "4,2" },

                ]);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, [userId]);

    return (
        <div className="page-container">

            <div className="result-container">
                <h1 className="result-title">Итоги</h1>

                <div className="container-wrapper-2">
                    <div className="container-home-2">
                    <h2>Сведения об успеваемости</h2>
                    <Table className="result-table" striped bordered hover>
                        <thead>
                        <tr>
                            <th>Предмет</th>
                            <th>Средняя оценка</th>
                        </tr>
                        </thead>
                        <tbody>
                        {subjects.map((subject, index) => (
                            <tr key={index}>
                                <td>{subject.name}</td>
                                <td>{subject.average}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                    </div>
                </div>
                </div>
                <Footer/>
            </div>
            );
            };

            export default ResultsPage;
