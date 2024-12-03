import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/pages/Layout";
import Home from "./pages/pages/Home"; // Если Home не используется, можно убрать
import Blogs from "./pages/pages/Blogs"; // Если Blogs не используется, можно убрать
import Contact from "./pages/pages/Contact";
import NoPage from "./pages/NoPage";
import RegistrationPage from "./pages/pages/registration";
import LoginPage from "./pages/pages/login";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Стартовая страница без Layout */}
                <Route path="/" element={<LoginPage />} />

                {/* Остальные страницы с Layout */}
                <Route path="/*" element={<Layout />}>
                    <Route path="home" element={<Home />} />
                    <Route path="registration" element={<RegistrationPage />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="blogs" element={<Blogs />} /> {/* Пример для других страниц */}
                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
