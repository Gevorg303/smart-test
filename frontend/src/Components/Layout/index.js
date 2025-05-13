// Layout.js
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import Handbook from "../Handbook";
import './styles.css';
import Footer from "../Footer";
import AdminNavbar from "../adminNavbar";

const Layout = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [topText, setTopText] = useState();
    const location = useLocation();

    const [userRole, setUserRole] = useState();

    useEffect(() => {

        async function fetchUser() {
            try {
                const response = await fetch('http://localhost:8081/users/current', {
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
                const user = await response.json();
                console.log(user);
                setUserRole(user.role.id);
            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }

        fetchUser();

        const container = document.querySelector('.all-container');
        const container_top = document.querySelector('.top-text');

        if (container) {
            if (location.pathname.includes('register') || location.pathname.includes('profile')) {
                container.classList.add('page-style-1');
            } else {
                container.classList.add('page-style-2');
            }
        }

        if (container_top) {
            if (location.pathname.includes('register') || location.pathname.includes('profile')) {
                container_top.classList.add('page-style-top-1');
            } else {
                container_top.classList.add('page-style-top-2');
            }
        }

        // Функция очистки
        return () => {
            if (container) {
                container.classList.remove('page-style-1', 'page-style-2');
            }
            if (container_top) {
                container_top.classList.remove('page-style-top-1', 'page-style-top-2');
            }
        };
        }, [location.pathname]);

    return (
        <div className={userRole == 1 ? "admin-body" : "body"}>
            {userRole == 1 ? <AdminNavbar/> : <Navbar setShowHandbook={setIsModalOpen} userRole={userRole} />}

            <div  className={userRole == 1 ? "all-content-admin" : "all-content"}>
                <div className="top-text">{topText}</div>
                <div  className="all-container">
                    <Outlet context={[topText, setTopText]} />
                </div>
            </div>
            <Handbook isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            <footer className="footer">
                <Footer />
            </footer>
        </div>
    );
};

            export default Layout;