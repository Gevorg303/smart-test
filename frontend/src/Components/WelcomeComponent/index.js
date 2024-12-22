import React, {useState} from 'react';

const WelcomeComponent = () => {
    const [text, setText] = useState("");
    return (
        <h1 id="welcome">
            {text}
        </h1>
    );
};

export default WelcomeComponent ;