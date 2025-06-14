import React, { useEffect, useState } from 'react';
import { Form, Button, Stack } from "react-bootstrap";
import ThemeAndIndicatorSelector from "../../FormModule/ThemeAndIndicatorSelector";
import CreateIndicatorPage from "../CreateIndicatorPage";
import SingleIndicatorSelector from "../../FormModule/SingleIndicatorSelector";
import "./styles.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Sorting = ({ type, setBankItems }) => {
    const roleMapping = {
        'Админ': 1,
        'Учитель': 2,
        'Ученик': 3
    };

    const [subjects, setSubjects] = useState([]);
    const [themes, setThemes] = useState([]);
    const [indicators, setIndicators] = useState([]);
    const [testTypes, setTestTypes] = useState([]);
    const [classes, setClasses] = useState([]);
    const [roles, setRoles] = useState([]);
    const [mainBlock, setMainBlock] = useState();

    const [targetSubject, setTargetSubject] = useState(0);
    const [targetTypeTest, setTargetTypeTest] = useState(0);
    const [currentTheme, setCurrentTheme] = useState(0);
    const [currentIndicator, setCurrentIndicator] = useState(0);
    const [currentClass, setCurrentClass] = useState(0);
    const [filterType, setFilterType] = useState('class'); // 'class' или 'role'
    const [selectedFilter, setSelectedFilter] = useState(0);

    useEffect(() => {
        async function fetchFilterOptions() {
            try {
                document.cookie = "sub=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
                document.cookie = "test=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
                const response1 = await fetch(process.env.REACT_APP_SERVER_URL+'users/current', {
                    credentials: "include",
                });
                if (!response1.ok) {
                    throw new Error('Ошибка сети');
                }
                const user = await response1.json();
                const subjectsResponse = await fetch(process.env.REACT_APP_SERVER_URL+'subject/print-user-subject', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify(user)
                });
                if (!subjectsResponse.ok) {
                    throw new Error('Ошибка получения предметов');
                }
                const subjectsData = await subjectsResponse.json();
                setSubjects(subjectsData);

                const testTypesResponse = await fetch(process.env.REACT_APP_SERVER_URL+'type-test/all', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                });
                if (!testTypesResponse.ok) {
                    throw new Error('Ошибка получения типов тестов');
                }
                const testTypesData = await testTypesResponse.json();
                setTestTypes(testTypesData);

                const currentUserResponse = await fetch(process.env.REACT_APP_SERVER_URL+'users/current', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!currentUserResponse.ok) {
                    throw new Error('Ошибка получения данных о текущем пользователе');
                }

                const currentUser = await currentUserResponse.json();

                const classesResponse = await fetch(process.env.REACT_APP_SERVER_URL+'users/find-student-class-by-user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(currentUser)
                });

                if (!classesResponse.ok) {
                    throw new Error('Ошибка получения данных о классах');
                }

                const classesData = await classesResponse.json();
                setClasses(classesData);

              /*  const rolesResponse = await fetch(process.env.REACT_APP_SERVER_URL+'users/all', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                });

                if (!rolesResponse.ok) {
                    const errorText = await rolesResponse.text();
                    throw new Error(`Ошибка получения ролей: ${errorText}`);
                }

                const rolesData = await rolesResponse.json();
                setRoles(rolesData);*/
            } catch (error) {
                console.error('Ошибка получения данных для фильтрации:', error);
            }
        }

        fetchFilterOptions();
    }, [type]);

    const handleClassChange = (e) => {
        const selectedClassId = e.target.value;
        setCurrentClass(selectedClassId);
        console.log('Выбранный класс:', selectedClassId);
    };

    const handleSearch = async (roleId = null) => {
        try {
            const userResponse = await fetch(process.env.REACT_APP_SERVER_URL+'users/current', {
                credentials: "include",
            });
            if (!userResponse.ok) {
                throw new Error('Ошибка сети');
            }
            const user = await userResponse.json();

            let url = '';
            let requestBody = {};
            let subjectId = parseInt(targetSubject, 10);
            let themeId = parseInt(currentTheme, 10);
            let testTypeId = parseInt(targetTypeTest, 10);
            let indicatorId = parseInt(currentIndicator, 10);
            let classId = parseInt(currentClass, 10);

            switch (type) {
                case 'test':
                    if(subjectId > 0 || themeId > 0 || testTypeId > 0){
                        url = process.env.REACT_APP_SERVER_URL+'bank-filters/tests';
                        requestBody = {
                            user,
                            subject: subjectId > 0 ? { id: subjectId } : null,
                            theme: themeId > 0 ? { id: themeId } : null,
                            testType: testTypeId > 0 ? { id: testTypeId } : null,
                        };
                    } else {
                        url = process.env.REACT_APP_SERVER_URL+'test/get-user-tests';
                        requestBody = user;
                    }


                    break;
                case 'task':
                    if(subjectId > 0 || themeId > 0 || indicatorId > 0){
                        url = process.env.REACT_APP_SERVER_URL+'bank-filters/tasks';
                        requestBody = {
                            user,
                            subject: subjectId > 0 ? { id: subjectId } : null,
                            theme: themeId > 0 ? { id: themeId } : null,
                            indicator: indicatorId > 0 ? { id: indicatorId } : null,
                        };
                    } else {
                        url = process.env.REACT_APP_SERVER_URL+'task/get-user-tasks';
                        requestBody = user;
                    }

                    break;
                case 'subject':
                    if(classId > 0){
                        url = process.env.REACT_APP_SERVER_URL+'bank-filters/subjects';
                        requestBody = {
                            user,
                            class: classId > 0 ? { id: classId } : null,
                        };
                    } else {
                        url = process.env.REACT_APP_SERVER_URL+'subject/print-user-subject';
                        requestBody = user;
                    }
                    break;
                case 'theme':
                    if(subjectId > 0){
                        url = process.env.REACT_APP_SERVER_URL+'theme/get-by-subject';
                        requestBody = {
                            id: subjectId > 0 ?  subjectId : null,
                        };
                    } else {
                        url = process.env.REACT_APP_SERVER_URL+'theme/get-theme-by-id-user';
                        requestBody = user;
                    }
                    break;
                case 'indicator':
                    if (subjectId > 0 || themeId > 0) {
                        url = process.env.REACT_APP_SERVER_URL+'indicator/indicator-by-theme';
                        requestBody = { id: themeId }
                    } else {
                        url = process.env.REACT_APP_SERVER_URL+'bank-filters/indicators';
                        requestBody = {
                            user,
                            subject: subjectId > 0 ? { id: subjectId } : null,
                        };
                    }
                    break;
                case 'student':
                    if (filterType === 'class') {
                        url = process.env.REACT_APP_SERVER_URL+'bank-filters/user';
                        requestBody = {
                            id: classId
                        };
                    } else {
                        url = process.env.REACT_APP_SERVER_URL+'users/all';
                        requestBody = {
                            userDto: user,
                            roleDto: roleId ? { id: roleId } : null
                        };
                    }
                    break;
                default:
                    return;
            }

            console.log(url);
            console.log(requestBody);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify(requestBody)
            });
            if (!response.ok) {
                throw new Error('Ошибка фильтрации');
            }
            const filteredItems = await response.json();
            setBankItems(filteredItems);
        } catch (error) {
            console.error('Ошибка фильтрации данных:', error);
        }
    };

    const resetFilters = () => {
        setTargetSubject(0);
        setTargetTypeTest(0);
        setCurrentTheme(0);
        setCurrentIndicator(0);
        setCurrentClass(0);
        setFilterType('class');
        setSelectedFilter(0);
        handleSearch(); // Запускаем метод all без роли
    };

    return (
        <>
            <Container fluid={true}>
                <Row>

            {type === 'task' ?
                <>

                        <Col>
                            <div className="button-containers-filter">
                                <Form.Group>
                                    <Form.Label>Предмет</Form.Label>
                                    <Form.Select
                                        onChange={(e) => {
                                            setTargetSubject(e.target.value);
                                            console.log(targetSubject)
                                        }} value={targetSubject}>
                                        <option value={-1}>Выберите предмет</option>
                                        {subjects.map((item, index) => <option key={item.id}
                                                                               value={item.id}> {item.subjectName}  </option>)}
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </Col>
                        <Col>
                            <div className="button-containers-filter">
                                <Form.Group>
                                    <Form.Label>Тема</Form.Label>
                                    <ThemeAndIndicatorSelector needIndicators={false} targetSubject={targetSubject}
                                                               currentTheme={currentTheme}
                                                               setCurrentTheme={setCurrentTheme}/>
                                </Form.Group>
                            </div>
                        </Col>
                        <Col>
                            <div className="button-containers-filter">
                                <Form.Group>
                                    <Form.Label>Индикатор</Form.Label>
                                    <SingleIndicatorSelector targetTheme={currentTheme}
                                                             currentIndicator={currentIndicator}
                                                             setCurrentIndicator={setCurrentIndicator}/>
                                </Form.Group>
                            </div>
                        </Col>
                </>
                : <></>
            }
            {type === 'test' ?
                <>
                    <Col>
                        <div className="button-containers-filter">
                            <Form.Group>
                                <Form.Label>Предмет</Form.Label>
                                <Form.Select
                                    onChange={(e) => {
                                        setTargetSubject(e.target.value);
                                        console.log(targetSubject)
                                    }} value={targetSubject}>
                                    <option value={-1}>Выберите предмет</option>
                                    {subjects.map((item, index) => <option key={item.id}
                                                                           value={item.id}> {item.subjectName}  </option>)}
                                </Form.Select>
                            </Form.Group>
                        </div>
                    </Col>

                    <Col>
                        <div className="button-containers-filter">
                            <Form.Group>
                                <Form.Label>Тема</Form.Label>
                                <ThemeAndIndicatorSelector needIndicators={false} targetSubject={targetSubject}
                                                           currentTheme={currentTheme}
                                                           setCurrentTheme={setCurrentTheme}/>
                            </Form.Group>
                        </div>
                    </Col>
                    <Col>
                        <div className="button-containers-filter">
                            <Form.Group>
                                <Form.Label>Тип теста</Form.Label>
                                <Form.Select
                                    value={targetTypeTest}
                                    onChange={(e) => {
                                        setTargetTypeTest(e.target.value)
                                    }}
                                >
                                    <option value={-1}>Выберите тип теста</option>
                                    {testTypes.length > 0 ? (
                                        testTypes.map((testType) => (
                                            <option key={testType.id} value={testType.id}>
                                                {testType.nameOfTestType}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>Нет данных</option>
                                    )}
                                </Form.Select>
                            </Form.Group>
                        </div>
                    </Col>

                </>
                : <></>}
            {type === 'indicator' ?
                <>
                    <Col>
                    <div className="button-containers-filter">
                        <Form.Group>
                            <Form.Label>Предмет</Form.Label>
                            <Form.Select
                                onChange={(e) => {
                                    setTargetSubject(e.target.value);
                                    console.log(targetSubject)
                                }} value={targetSubject}>
                                <option value={-1}>Выберите предмет</option>
                                {subjects.map((item, index) => <option key={item.id}
                                                                       value={item.id}> {item.subjectName}  </option>)}
                            </Form.Select>
                        </Form.Group>
                    </div>
                        </Col>
                    <Col>
                    <div className="button-containers-filter">
                        <Form.Group>
                            <Form.Label>Тема</Form.Label>
                            <ThemeAndIndicatorSelector needIndicators={false}
                                                       targetSubject={targetSubject}
                                                       currentTheme={currentTheme}
                                                       setCurrentTheme={setCurrentTheme} />
                        </Form.Group>
                    </div>
                        </Col>
                </>
                : <></>}
            {type === 'theme' ?
                <>
                    <Col>
                    <div className="button-containers-filter">
                        <Form.Group>
                            <Form.Label>Предмет</Form.Label>
                            <Form.Select
                                onChange={(e) => {
                                    setTargetSubject(e.target.value);
                                    console.log(targetSubject)
                                }} value={targetSubject}>
                                <option value={-1}>Выберите предмет</option>
                                {subjects.map((item, index) => <option key={item.id}
                                                                       value={item.id}> {item.subjectName}  </option>)}
                            </Form.Select>
                        </Form.Group>
                    </div>
                        </Col>
                </>
                : <></>}
            {type === 'student' && (
                <>





                    <Col>
                    <div className="button-containers-filter">
                        <Form.Group>
                            <Form.Label>Фильтр</Form.Label>
                            <Form.Select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="class">По классу</option>
                                <option value="role">По роли</option>
                            </Form.Select>
                        </Form.Group>
                    </div>
                        </Col>
                    <Col>
                    <div className="button-containers-filter">
                        <Form.Group>
                            <Form.Label>{filterType === 'class' ? 'Класс' : 'Роль'}</Form.Label>
                            <Form.Select
                                value={filterType === 'class' ? currentClass : selectedFilter}
                                onChange={filterType === 'class' ? handleClassChange : (e) => setSelectedFilter(e.target.value)}
                            >
                                <option value="">Выберите {filterType === 'class' ? 'класс' : 'роль'}</option>
                                {filterType === 'class' ? (
                                    classes.map((cls) => (
                                        <option key={cls.id} value={cls.id}>
                                            {`${cls.numberOfInstitution} ${cls.letterDesignation}`}
                                        </option>
                                    ))
                                ) : (
                                    Object.keys(roleMapping).map((roleName) => (
                                        <option key={roleMapping[roleName]} value={roleMapping[roleName]}>
                                            {roleName}
                                        </option>
                                    ))
                                )}
                            </Form.Select>
                        </Form.Group>
                    </div>
                        </Col>
                    <Col>
                        <Button variant="secondary" className="reset-button" onClick={resetFilters} >Сбросить фильтры</Button>
                    </Col>
                    <Col>
                        <Button variant="primary" className="search-button" onClick={() => handleSearch(selectedFilter)}>Применить фильтр</Button>
                    </Col>
                </>
            )}

            {mainBlock}
                </Row>

            </Container>
                {type !== 'student' && type !== 'subject' && (
                    <div className="button-group">
                        <Button variant="primary" className="search-button" onClick={handleSearch}>Поиск</Button>
                    </div>
                )}

        </>
    );
};

export default Sorting;