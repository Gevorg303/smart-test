import React from 'react';

const WelcomeComponent = (props) => {
    return (
        <h1 id="welcome">
            {props.text}
        </h1>
    );
};

export default WelcomeComponent ;