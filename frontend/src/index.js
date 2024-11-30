import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/pages/Layout";
import Home from "./pages/pages/Home";
import Blogs from "./pages/pages/Blogs";
import Contact from "./pages/pages/Contact";
import NoPage from "./pages/NoPage";
import RegistrationPage from "./pages/pages/registration";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="registration" element={<RegistrationPage />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);