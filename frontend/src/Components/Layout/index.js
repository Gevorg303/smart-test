// Layout.js
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import Handbook from "../Handbook";
import './styles.css';
import Footer from "../Footer";

const Layout = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [topText, setTopText] = useState();

    return (
        <>
            <Navbar setShowHandbook={setIsModalOpen}/>
            <div className="all-content">
                <div className="top-text">{topText}</div>
                <div className="all-container">
                    <Outlet context={[topText, setTopText]}/>
                </div>
            </div>
            <Handbook isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
            <Footer/>
        </>
    );
};

export default Layout;
