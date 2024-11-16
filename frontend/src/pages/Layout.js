import { Outlet, Link } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Логотип</Link>
                    </li>
                    <li>
                        <Link to="/blogs">Предметы</Link>
                    </li>
                    <li>
                        <Link to="/registration">Зарегистрировать пользователя</Link>
                    </li>
                    <li>
                        <Link to="/info">Справка</Link>
                    </li>
                    <li>
                        <Link to="/contact">Личный кабинет</Link>
                    </li>
                </ul>
            </nav>

            <Outlet/>
        </>
    )
};

export default Layout;