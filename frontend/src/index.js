import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './Components/Home';
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

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Страница входа без Layout */}
                <Route path="/" element={<LoginPage />} />
                {/* Другие страницы с Layout */}
                <Route element={<PrivateRoutes />}>
                    <Route element={<Layout />}>
                        <Route path="home" element={<HomePage />} />
                        <Route path="start-test" element={<StartTestPage />} />
                        <Route path="test" element={<TestPage />} />
                        <Route path="register/single" element={<RegistrationPage />} />
                        <Route path="register/multiple" element={<RegistrationPage />} />
                        <Route path="testresult" element={<ViewTestResultsPage />} />
                        <Route path="theme" element={<ThemePage />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="results" element={<ResultsPage />} />
                        <Route path="testbank" element={<QuestionBankPage  type={"test"} />} />
                        <Route path="taskbank" element={<QuestionBankPage  type={"task"}/>} />
                        <Route path="itembank" element={<QuestionBankPage  type={"subject"}/>} />
                        <Route path="themebank" element={<QuestionBankPage  type={"theme"}/>} />
                        <Route path="indicatorbank" element={<QuestionBankPage  type={"indicator"}/>} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
