import React, {useEffect, useState} from 'react';
import {Navigate, Outlet, useOutletContext} from "react-router-dom";
import { useLocation } from 'react-router'
import SubjectCard from "../TestingModule/SubjectCard";
import TokenEndModal from "../UIModule/TokenEndModal";

const RouterByRole = ({rolesWithoutAccess, element}) => {

    const location = useLocation();
    const [userRole, setUserRole] = useState();
    const [topText, setTopText] = useOutletContext();
    const [page, setPage] = useState();

    useEffect(() => {
        async function fetchUser() {
            try {

                const response = await fetch(process.env.REACT_APP_SERVER_URL+'users/current', {
                    credentials: "include",
                });
                if (!response.ok) {
                    setPage(<TokenEndModal/>)
                    throw new Error('Ошибка сети');

                }
                const user = await response.json();
                console.log(user);
                //setUserRole(user.role.id)


                setPage(rolesWithoutAccess.includes(user.role.id) ?  <Navigate to={user.role.id == 1? "/admin-home":"/home"} state={{ from: location }} replace /> : element)
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