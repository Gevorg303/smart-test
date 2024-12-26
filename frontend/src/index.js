import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Components/Home";
import LoginPage from "./Components/Login";
import 'bootstrap/dist/css/bootstrap.min.css';
import StartTestPage from "./Components/StartTestPage";
import TestPage from "./Components/TestPage";
import RegistrationPage from "./Components/Registration";
import ViewTestResultsPage from "./Components/ViewOneTestResultPage";
import ThemePage from "./Components/ThemePage";
import ProfilePage from "./Components/ProfilePage";
import QuestionBankPage from "./Components/QuestionBankPage";
import PrivateRoutes from "./utils/router/privateRoute";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Стартовая страница без Layout */}
                <Route path="/" element={<LoginPage />} />
                {/* Остальные страницы с Layout */}
                <Route path="/*" exact element={<PrivateRoutes/>}>
                    <Route path="home" element={ <HomePage /> }/>
                    <Route path="start-test" element={<StartTestPage/> } />
                    <Route path="test" element={<TestPage/> } />
                    <Route path="register" element={<RegistrationPage/> } />
                    <Route path="testresult" element={<ViewTestResultsPage/> } />
                    <Route path="theme" element={<ThemePage/> } />
                    <Route path="profile" element={<ProfilePage/> } />
                    <Route path="bank" element={<QuestionBankPage/>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
