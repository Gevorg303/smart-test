import React, {useEffect, useState} from 'react';

const TestTimer = ({startTime, endTime, functionOnEnd, timeFromStart}) => {
    const currentTime = new Date();
    const [time, setTime] = useState(DateDiff(endTime, currentTime));

    useEffect(() => {

        if (currentTime.getTime() >= endTime.getTime()) {
            // console.log("functionOnEnd()");
            functionOnEnd(DateDiff(currentTime, startTime));
        } else {
            setTimeout(() => {
                timeFromStart(DateDiff(currentTime, startTime));
                setTime(DateDiff(endTime, currentTime));
                //setTime(currentTime - endTime);
            }, 1000)
        }
    }, [time]);

    function DateDiff(date1, date2) {
        const result = new Date();
        result.setHours(date1.getHours() - date2.getHours())
        result.setMinutes(date1.getMinutes() - date2.getMinutes())
        result.setSeconds(date1.getSeconds() - date2.getSeconds())
        return result
    }

    function TimeString() {
        if (time != undefined) {
            let hour = time.getHours();
            let min = time.getMinutes();
            let sec = time.getSeconds();
            return (hour < 10 ? "0" + hour : hour) + ":" + (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);
        }
    }

    return (
        <>
            <h2>{TimeString()}</h2>

        </>
    );
};

export default TestTimer;