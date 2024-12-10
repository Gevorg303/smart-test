import React, { useState } from 'react';

class SubjectCard extends React.Component {
    constructor(props) {
        super(props);
        this.subjectId = {value: ''};
        this.subjectName = {value: ''};
        this.subjectDescription = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return (
            <div className="card">

            </div>
        );
    }
}

export default SubjectCard;
