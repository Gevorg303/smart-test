import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Components/Home";
import LoginPage from "./Components/Login";
import 'bootstrap/dist/css/bootstrap.min.css';
import StartTestPage from "./Components/StartTestPage";
import TestPage from "./Components/TestPage";
import RegistrationPage from "./Components/Registration";
import ViewTestResultsPage from "./Components/ViewOneTestResultPage";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Стартовая страница без Layout */}
                <Route path="/" element={<LoginPage />} />
                {/* Остальные страницы с Layout */}
                <Route path="/*" /*element={<Layout />}*/>
                    <Route path="home" element={<HomePage />} />
                    <Route path="start-test" element={<StartTestPage/> } />
                    <Route path="test" element={<TestPage/> } />
                    <Route path="register" element={<RegistrationPage/> } />
                    <Route path="testresult" element={<ViewTestResultsPage/> } />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
