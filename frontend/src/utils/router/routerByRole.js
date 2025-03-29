import React, {useEffect, useState} from 'react';
import {Navigate, Outlet, useOutletContext} from "react-router-dom";
import { useLocation } from 'react-router'
import SubjectCard from "../../Components/SubjectCard";

const RouterByRole = ({rolesWithoutAccess, element}) => {

    const location = useLocation();
    const [userRole, setUserRole] = useState();
    const [topText, setTopText] = useOutletContext();
    const [page, setPage] = useState();

    useEffect(() => {
        async function fetchUser() {
            try {

                const response = await fetch('http://localhost:8080/users/current', {
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
                const user = await response.json();
                console.log(user);
                //setUserRole(user.role.id)


                setPage(rolesWithoutAccess.includes(user.role.id) ?  <Navigate to="/home" state={{ from: location }} replace /> : element)
            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }

        fetchUser();
    }, [element]);

    return (
        <>
            {/*<Outlet context={[topText, setTopText]} />*/}
                {page}
        </>

    )
};

export default RouterByRole;