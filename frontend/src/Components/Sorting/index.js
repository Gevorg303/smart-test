import React, {useEffect, useState} from 'react';
import {Form, Button} from "react-bootstrap";
import ThemeAndIndicatorSelector from "../ThemeAndIndicatorSelector";
import CreateIndicatorPage from "../CreateIndicatorPage";
import SingleIndicatorSelector from "../SingleIndicatorSelector";
import "./styles.css";


const Sorting = ({type,setBankItems}) => {

    //const [filterCriteria, setFilterCriteria] = useState({ subject: 0, theme: 0, indicator: 0, testType: 0, class: 0 });
    const [subjects, setSubjects] = useState([]);
    const [themes, setThemes] = useState([]);
    const [indicators, setIndicators] = useState([]);
    const [testTypes, setTestTypes] = useState([]);
    const [classes, setClasses] = useState([]);
    const [mainBlock, setMainBlock] = useState();

    const [targetSubject, setTargetSubject] = useState(0);
    const [targetTypeTest, setTargetTypeTest] = useState(0);
    const [currentTheme, setCurrentTheme] = useState(0);
    const [currentIndicator, setCurrentIndicator] = useState(0);
    const [currentClass, setCurrentClass] = useState(0);

    useEffect(() => {
        async function fetchFilterOptions() {
            try {
                const subjectsResponse = await fetch('http://localhost:8080/subject/all', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                });
                if (!subjectsResponse.ok) {
                    throw new Error('Ошибка получения предметов');
                }
                const subjectsData = await subjectsResponse.json();
                setSubjects(subjectsData);


                const testTypesResponse = await fetch('http://localhost:8080/type-test/all', {
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








                /*const response1 = await fetch('http://localhost:8080/users/current', {
                    credentials: "include",
                });
                if (!response1.ok) {
                    throw new Error('Ошибка сети');
                }
                const user = await response1.json();*/


                /*const classesResponse = await fetch('http://localhost:8080/class/all', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    //body: JSON.stringify(user.)
                });
                if (!classesResponse.ok) {
                    throw new Error('Ошибка получения классов');
                }
                const classesData = await classesResponse.json();
                setClasses(classesData);*/


            } catch (error) {
                console.error('Ошибка получения данных для фильтрации:', error);
            }
        }

        fetchFilterOptions();
    }, [type]);

    const handleSearch = async () => {
        try {
            const userResponse = await fetch('http://localhost:8080/users/current', {
                credentials: "include",
            });
            if (!userResponse.ok) {
                throw new Error('Ошибка сети');
            }
            const user = await userResponse.json();

            let url = '';
            let requestBody = {};
            let subjectId = parseInt(targetSubject ,10 );
            let themeId = parseInt(currentTheme ,10 );
            let testTypeId = parseInt(targetTypeTest ,10 );
            let indicatorId = parseInt(currentIndicator ,10 );
            let classId = parseInt(currentClass,10)


            switch (type) {
                case 'test':
                    if ( themeId>0 && testTypeId<=0)
                    {
                        url = 'http://localhost:8080/test/get-test-id-theme';
                        requestBody = {id:themeId}
                    }
                    else{
                        url = 'http://localhost:8080/bank-filters/tests';
                        requestBody = {
                            user,
                            subject: subjectId>0 ? { id: subjectId } : null,
                            //theme: themeId>0 ? { id: themeId } : null,
                            testType: testTypeId>0 ? { id: testTypeId } : null,
                        };
                    }
                    break;
                case 'task':
                    url = 'http://localhost:8080/bank-filters/tasks';
                    requestBody = {
                        user,
                        subject: subjectId>0 ? { id: subjectId } : null,
                        theme: themeId>0 ? { id: themeId } : null,
                        indicator: indicatorId>0 ? { id: indicatorId } : null,
                    };
                    break;
                case 'subject':
                    url = 'http://localhost:8080/bank-filters/subjects';//поменять на class
                    requestBody = {
                        user,
                        class: classId>0 ? { id: classId } : null,
                    };
                    break;
                case 'theme':
                    url = 'http://localhost:8080/theme/get-by-subject';
                    requestBody = {
                        id: subjectId
                    };
                    break;
                case 'indicator':
                    if ( subjectId>0 && themeId > 0)
                    {
                        url = 'http://localhost:8080/indicator/indicator-by-theme';
                        requestBody = {id:themeId}
                    }
                    else{
                    url = 'http://localhost:8080/bank-filters/indicators';
                    requestBody = {
                        user,
                        subject: subjectId>0 ? { id: subjectId } : null,
                    };}
                    break;
                default:
                    return;
            }


            console.log(url)
            console.log(requestBody)





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

    return (
        <>
            {type === 'task' ?
                <>
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
                                                                       value={item.id}> {item.subjectName/* + " " + item.teacherClass.studentClass.numberOfInstitution + item.teacherClass.studentClass.letterDesignation*/}  </option>)}

                            </Form.Select>
                        </Form.Group>
                    </div>
                    <div className="button-containers-filter">
                        <Form.Group>
                            <Form.Label>Тема</Form.Label>
                            <ThemeAndIndicatorSelector needIndicators={false} targetSubject={targetSubject}
                                                       currentTheme={currentTheme} setCurrentTheme={setCurrentTheme}/>
                        </Form.Group>
                    </div>
                    <div className="button-containers-filter">
                        <Form.Group>
                            <Form.Label>Индикатор</Form.Label>
                            <SingleIndicatorSelector targetTheme={currentTheme} currentIndicator={currentIndicator}
                                                     setCurrentIndicator={setCurrentIndicator}/>
                        </Form.Group>
                    </div>
                    </>
                    :<></>
                    }
                    {type === 'test' ?
                        <>
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
                                                                               value={item.id}> {item.subjectName/* + " " + item.teacherClass.studentClass.numberOfInstitution + item.teacherClass.studentClass.letterDesignation*/}  </option>)}

                                    </Form.Select>
                                </Form.Group>
                            </div>
                            <div className="button-containers-filter">
                                <Form.Group>
                                    <Form.Label>Тема</Form.Label>
                                    <ThemeAndIndicatorSelector needIndicators={false} targetSubject={targetSubject}
                                                               currentTheme={currentTheme}
                                                               setCurrentTheme={setCurrentTheme}/>
                                </Form.Group>

                            </div>
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
                            </>
                            : <></>}
                            {type === 'indicator' ?
                                <>
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
                                                                                       value={item.id}> {item.subjectName/* + " " + item.teacherClass.studentClass.numberOfInstitution + item.teacherClass.studentClass.letterDesignation*/}  </option>)}

                                            </Form.Select>
                                            </Form.Group>
                                    </div>
                                    <div className="button-containers-filter">
                                        <Form.Group>
                                        <Form.Label>Тема</Form.Label>
                                        <ThemeAndIndicatorSelector needIndicators={false}
                                                                   targetSubject={targetSubject}
                                                                   currentTheme={currentTheme}
                                                                   setCurrentTheme={setCurrentTheme}/>
                                        </Form.Group>
                                </div>
                                </>
                                : <></>}
                                    {type === 'theme' ?
                                        <>
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
                                                                                               value={item.id}> {item.subjectName/* + " " + item.teacherClass.studentClass.numberOfInstitution + item.teacherClass.studentClass.letterDesignation*/}  </option>)}

                                                    </Form.Select>
                                                </Form.Group>
                                            </div>
                                            </>
                                            : <></>}
                                            {type === 'subject' ?
                                                <>
                                                    <div className="button-containers-filter">
                                                        <Form.Group>
                                                            <Form.Label>Класс</Form.Label>
                                                            <Form.Select
                                                                /*value={filterCriteria.class} //заменить на currentClass
                                                                onChange={(e) => setFilterCriteria({ ...filterCriteria, class: e.target.value })}*/
                                                            >
                                                                <option value="">Выберите класс</option>
                                                                {classes.length > 0 ? (
                                                                    classes.map((cls) => (
                                                                        <option key={cls.id} value={cls.id}>
                                                                            {cls.letterDesignation + cls.numberOfInstitution}
                                                                        </option>
                                                                    ))
                                                                ) : (
                                                                    <option disabled>Нет данных</option>
                                                                )}
                                                            </Form.Select>
                                                        </Form.Group>
                                                    </div>
                                                    </>
                                                    : <></>}
                                                    <Button variant="primary" onClick={handleSearch}>Поиск</Button>
                                                    {mainBlock}
                                                </>
                                                );
                                    };

            export default Sorting;