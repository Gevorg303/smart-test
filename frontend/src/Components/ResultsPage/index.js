import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import './styles.css';
import Navbar from "../Navbar";
import Footer from "../Footer";


const ResultsPage = ({ userId }) => {
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setSubjects([{name:"Математика",average:"4,3"},{name:"Математика",average:"4,3"},{name:"Математика",average:"4,3"},{name:"Математика",average:"4,3"}]);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, [userId]);

    return (
        <div>
            <Navbar IsTeacher={true}/>
        <div className="result-container">
            <h1 className="result-title">Итоги</h1>
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
    <Footer />
    </div>
    );
};

export default ResultsPage;