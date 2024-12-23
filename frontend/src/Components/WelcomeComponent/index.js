import React from 'react';
import './styles.css';

const WelcomeComponent = (props) => {
    return (
        <h1 id="welcome">
            {props.text}
        </h1>
    );
};

export default WelcomeComponent;
