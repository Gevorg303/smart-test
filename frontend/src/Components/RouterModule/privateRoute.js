import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'



export default function PrivateRoutes() {
    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
    let  userid = getCookie("accessToken")
    return (
        <>
            {userid ? <Outlet  /> : <Navigate to="/" />}
        </>

    )

}