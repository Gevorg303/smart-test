import React, {useState, useEffect,useRef} from 'react';
import { Button, Container } from 'react-bootstrap';

const PhotoUploadButton = () => {
  //  var Minio = require('minio');

 /*   var minioClient = new Minio.Client({
        endpoint: 'play.min.io',
        port: '9000',
        useSSL: 'true',
        accessKey: 'vmPPmXl8tsjA8FOHIm8H',
        sectetkey: 'mJI8xnk3M1XK1XvaDGTi0IRz3BUr2U2HyAyi3YvR',
        })
*/
    const inputFile = useRef(null);

   const onButtonClick = () => {
        inputFile.current.click();
    };
    return (
        <>
            <input
                style={{display: "none"}}
                accept=".jpg,.png"
                ref={inputFile}
                type="file"
            />
            <Button variant="success" className="" onClick={onButtonClick}>Редактировать фото</Button>
        </>
    );
};

export default PhotoUploadButton;