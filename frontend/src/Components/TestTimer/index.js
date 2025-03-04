import React, { useEffect, useState } from 'react';

const TestTimer = ({durationHour, durationMin,durationSec,start,functionOnEnd,timeFromStart}) => {
    const [time, setTime] = useState(durationHour*3600+durationMin*60+durationSec);
    const [startTime, setStartTime] = useState(durationHour*3600+durationMin*60+durationSec);
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
        let min = Math.floor(parseInt(time)/60%60) ;
        let hour = Math.floor(parseInt(time)/3600) ;
        return  (hour < 10?"0"+hour:hour) + ":"+(min < 10?"0"+min:min) + ":"+(sec<10?"0"+sec:sec);
    }
    return (
        <>
            <h2>{TimeString()}</h2>

        </>
    );
};

export default TestTimer;