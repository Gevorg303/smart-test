import React ,{useState} from 'react';
import Navbar from '../Navbar'; // Обновите путь к Navbar
import { Outlet } from 'react-router-dom';
import Handbook from "../Handbook";

const Layout = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Navbar setShowHandbook={setIsModalOpen}/>
            <Outlet />
            <Handbook isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
        </>
    );
};

export default Layout;
