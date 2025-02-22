import React, { useEffect, useState } from 'react';

const TestTimer = ({durationMin,durationSec,start,functionOnEnd,timeFromStart}) => {
    const [time, setTime] = useState(durationMin*60+durationSec);
    const [startTime, setStartTime] = useState(durationMin*60+durationSec);
    useEffect(() => {
      if(start) {
          if (time <= 0) {
              functionOnEnd();
          } else {
              setTimeout(() => {
                  timeFromStart(startTime - time-1);
                  setTime(time - 1);
              }, 1000)
          }
      }
    }, [time,start]);
    function TimeString(){
        let sec = time % 60;
        let min = Math.floor(parseInt(time)/60) ;
        return  (min < 10?"0"+min:min) + ":"+(sec<10?"0"+sec:sec);
    }
    return (
        <>
            <h2>{TimeString()}</h2>

        </>
    );
};

export default TestTimer;