import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './Components/Home';
import BetaPage from "./Components/BetaPage";
import ClassBank from './Components/ClassBank';
import LoginPage from './Components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import StartTestPage from './Components/StartTestPage';
import TestPage from './Components/TestPage';
import RegistrationPage from './Components/Registration';
import ViewTestResultsPage from './Components/ViewOneTestResultPage';
import ThemePage from './Components/ThemePage';
import ProfilePage from './Components/ProfilePage';
import QuestionBankPage from './Components/QuestionBankPage';
import PrivateRoutes from './utils/router/privateRoute';
import Layout from './Components/Layout';
import ResultsPage from "./Components/ResultsPage";
import SubjectClassPage from "./Components/SubjectClassPage";
import RouterByRole from "./utils/router/routerByRole";
import AdminHome from "./Components/AdminHome";


const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Страница входа без Layout и AdminNavbar */}
                <Route path="/" element={<LoginPage />} />
                {/* BetaPage без Layout, но с AdminNavbar */}
                <Route path="bPage" element={<BetaPage />} />
                <Route path="ClassBank" element={<ClassBank />} />
                {/* Другие страницы с Layout */}
                <Route element={<PrivateRoutes />}>
                    <Route element={<Layout />}>
                        <Route path="admin-home" element={<RouterByRole rolesWithoutAccess={[2,3]} element={<AdminHome />} />} />
                        <Route path="home" element={<RouterByRole rolesWithoutAccess={[1]} element={<HomePage />} />} />
                        <Route path="start-test" element={<RouterByRole rolesWithoutAccess={[]} element={<StartTestPage />} />} />
                        <Route path="test" element={<RouterByRole rolesWithoutAccess={[]} element={<TestPage />} />} />
                        <Route path="register/single" element={<RouterByRole rolesWithoutAccess={[3]} element={<RegistrationPage />} />} />
                        <Route path="register/multiple" element={<RouterByRole rolesWithoutAccess={[3]} element={<RegistrationPage />} />} />
                        <Route path="testresult" element={<RouterByRole rolesWithoutAccess={[]} element={<ViewTestResultsPage />} />} />
                        <Route path="theme" element={<RouterByRole rolesWithoutAccess={[]} element={<ThemePage />} />} />
                        <Route path="profile" element={<RouterByRole rolesWithoutAccess={[]} element={<ProfilePage />} />} />
                        <Route path="results" element={<RouterByRole rolesWithoutAccess={[1,2]} element={<ResultsPage />} />} />
                        <Route path="testbank" element={<RouterByRole rolesWithoutAccess={[3]} element={<QuestionBankPage type={"test"} />} />} />
                        <Route path="taskbank" element={<RouterByRole rolesWithoutAccess={[3]} element={<QuestionBankPage type={"task"} />} />} />
                        <Route path="itembank" element={<RouterByRole rolesWithoutAccess={[3]} element={<QuestionBankPage type={"subject"} />} />} />
                        <Route path="themebank" element={<RouterByRole rolesWithoutAccess={[3]} element={<QuestionBankPage type={"theme"} />} />} />
                        <Route path="indicatorbank" element={<RouterByRole rolesWithoutAccess={[3]} element={<QuestionBankPage type={"indicator"} />} />} />
                        <Route path="subjectclass" element={<RouterByRole rolesWithoutAccess={[3]} element={<SubjectClassPage />} />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
