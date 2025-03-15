// Layout.js
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import Handbook from "../Handbook";

const Layout = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Navbar setShowHandbook={setIsModalOpen} />
            <Outlet />
            <Handbook isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </>
    );
};

export default Layout;
