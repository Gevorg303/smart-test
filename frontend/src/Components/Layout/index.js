// Layout.js
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import Handbook from "../Handbook";
import './styles.css';
import Footer from "../Footer";

const Layout = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [topText, setTopText] = useState();
    const location = useLocation();

    useEffect(() => {
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
        <>
            <Navbar setShowHandbook={setIsModalOpen} />
            <div className="all-content">
                <div className="top-text">{topText}</div>
                <div className="all-container">
                    <Outlet context={[topText, setTopText]} />
                </div>
            </div>
            <Handbook isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            <footer className="footer">
                <Footer />
            </footer>
        </>
    );
};

            export default Layout;