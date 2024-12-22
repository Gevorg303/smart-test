import React, {useState} from 'react';

const WelcomeComponent = (props) => {
    //const [text, setText] = useState("");
    return (
        <h1 id="welcome">
            {props.text}
        </h1>
    );
};

export default WelcomeComponent ;