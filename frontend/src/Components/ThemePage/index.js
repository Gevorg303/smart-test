import React, {useState, useEffect} from 'react';
import Navbar from "../Navbar";
import Theme from "../Theme";
import Footer from "../Footer";


const ThemePage = () => {
    const [subjectName,setSubjectName] = useState("Название предмета");
    const [themes,setThemes] = useState([]);

    useEffect(() => {
        function getCookie(name) {
            let matches = document.cookie.match(new RegExp(
                "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ));
            return matches ? decodeURIComponent(matches[1]) : undefined;
        }
        async function fetchSubjectName() {
            try {
                const subid = getCookie("sub");
                const response = await fetch('http://localhost:8080/subject/id:'+subid);
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
                const subject = await response.json();
                console.log(subject)
                setSubjectName(subject.subjectName);

            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }
        async function fetchThemes() {
            try {
                const subid = getCookie("sub");
                const response = await fetch(`http://localhost:8080/theme/getbysubject:${subid}`);
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
                const themes = await response.json();
                console.log(themes)
                let count = 0;
                const array =[]
                themes.forEach(subject => {
                    // console.log(subject.numberOfInstitution +" "+ subject.letterDesignation +" "+ subject.educationalInstitution.nameOfTheInstitution + " "+ subject.educationalInstitution.address)
                    // select.append(new Option(subject.numberOfInstitution +" "+ subject.letterDesignation +" "+ subject.educationalInstitution.nameOfTheInstitution + " "+ subject.educationalInstitution.address,subject.id))
                    //  const array = [...subjects]
                    array.push(
                        <Theme key={count++} id={subject.id} themeName={subject.themeName}  />
                    )
                    //   setSubjects(array);
                });
                setThemes(
                    array
                )

            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }
        fetchSubjectName();
        fetchThemes()
    }, []);

   /* for (let number = 1; number <= 3; number++) {
        tehemes.push(
            <Theme themeName={"Тема " + number}/>
        );
    }*/
    return (
        <>
            <Navbar/>
            <div>
                <h1>{subjectName}</h1>
                {themes}
            </div>
            <Footer/>
        </>
    );
};

export default ThemePage;