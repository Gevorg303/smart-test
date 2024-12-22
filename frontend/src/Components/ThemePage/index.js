import React from 'react';
import Navbar from "../Navbar";
import Theme from "../Theme";

const ThemePage = () => {
    let subjectName = "Название предмета"
    let tehemes = [];
    for (let number = 1; number <= 3; number++) {
        tehemes.push(
            <Theme themeName={"Тема " + number}/>
        );
    }
    return (
        <div>
          <h1>{subjectName}</h1>
            {tehemes}
        </div>
    );
};

export default ThemePage;