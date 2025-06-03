import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import BetaPage from "./pages/BetaPage";
import ClassBank from './pages/ClassBank';
import StudentBank from './pages/StudentBank';
import LoginPage from './pages/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import StartTestPage from './pages/StartTestPage';
import TestPage from './pages/TestPage';
import RegistrationPage from './pages/Registration';
import ViewTestResultsPage from './pages/ViewOneTestResultPage';
import ThemePage from './pages/ThemePage';
import ProfilePage from './pages/ProfilePage';
import QuestionBankPage from './pages/QuestionBankPage';
import PrivateRoutes from './Components/RouterModule/privateRoute';
import Layout from './Components/UIModule/Layout';
import ResultsPage from "./pages/ResultsPage";
import SubjectClassPage from "./pages/SubjectClassPage";
import RouterByRole from "./Components/RouterModule/routerByRole";
import AdminHome from "./pages/AdminHome";
import TeacherResultsPage from "./pages/TeacherResultsPage";


const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Страница входа без Layout и AdminNavbar */}
                <Route path="/" element={<LoginPage />} />
                {/* BetaPage без Layout, но с AdminNavbar */}

                {/* Другие страницы с Layout */}
                <Route element={<PrivateRoutes />}>
                    <Route element={<Layout />}>
                        <Route path="admin-home" element={<RouterByRole rolesWithoutAccess={[2,3]} element={<AdminHome />} />} />
                        <Route path="home" element={<RouterByRole rolesWithoutAccess={[1]} element={<HomePage />} />} />
                        <Route path="bPage" element={<BetaPage />} />
                        <Route path="start-test" element={<RouterByRole rolesWithoutAccess={[]} element={<StartTestPage />} />} />
                        <Route path="test" element={<RouterByRole rolesWithoutAccess={[]} element={<TestPage />} />} />
                        <Route path="register/single" element={<RouterByRole rolesWithoutAccess={[3]} element={<RegistrationPage />} />} />
                        <Route path="register/multiple" element={<RouterByRole rolesWithoutAccess={[3]} element={<RegistrationPage />} />} />
                        <Route path="testresult" element={<RouterByRole rolesWithoutAccess={[]} element={<ViewTestResultsPage />} />} />
                        <Route path="theme" element={<RouterByRole rolesWithoutAccess={[]} element={<ThemePage />} />} />
                        <Route path="profile" element={<RouterByRole rolesWithoutAccess={[]} element={<ProfilePage />} />} />
                        <Route path="result" element={<RouterByRole rolesWithoutAccess={[1,2]} element={<ResultsPage />} />} />
                        <Route path="results" element={<RouterByRole rolesWithoutAccess={[3]} element={<TeacherResultsPage />} />} />
                        <Route path="testbank" element={<RouterByRole rolesWithoutAccess={[3]} element={<QuestionBankPage type={"test"} />} />} />
                        <Route path="taskbank" element={<RouterByRole rolesWithoutAccess={[3]} element={<QuestionBankPage type={"task"} />} />} />
                        <Route path="itembank" element={<RouterByRole rolesWithoutAccess={[3]} element={<QuestionBankPage type={"subject"} />} />} />
                        <Route path="themebank" element={<RouterByRole rolesWithoutAccess={[3]} element={<QuestionBankPage type={"theme"} />} />} />
                        <Route path="indicatorbank" element={<RouterByRole rolesWithoutAccess={[3]} element={<QuestionBankPage type={"indicator"} />} />} />
                        <Route path="studentbank" element={<RouterByRole rolesWithoutAccess={[3]} element={<QuestionBankPage type={"student"} />} />} />
                        <Route path="ClassBank" element={<RouterByRole rolesWithoutAccess={[3]} element={<QuestionBankPage type={"class"} />} />} />
                        <Route path="subjectclass" element={<RouterByRole rolesWithoutAccess={[3]} element={<SubjectClassPage />} />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
