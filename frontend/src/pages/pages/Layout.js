import { Outlet, Link } from "react-router-dom";
import logo from '../logo.ico';

const Layout = () => {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to="/">
                            <img src={logo} alt="Логотип" style={{width: '20px', height: '20px'}}/>
                        </Link>
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
    );
};

export default Layout;