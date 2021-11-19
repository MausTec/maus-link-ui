import React, { useContext, useState, useEffect, memo } from "react";
import {ReadingsContext} from "../DeviceProvider";


const Timer = ({ seconds, active, className, style }) => {
  const readings = useContext(ReadingsContext);
  const [thresholdTime, setthresholdTime] = useState(seconds);
  const [mymillis, setmymillis] = useState(readings.lastReading.millis)
  const [isActive, setIsActive] = useState(false);
  const [timer,setTimervalue] = useState(0);
  
  useEffect(() => {
    if (active) {
      setthresholdTime((seconds*1000)+readings.lastReading.millis);
      setIsActive(true);
    } else {
      setthresholdTime((seconds*1000)+readings.lastReading.millis);
      setIsActive(false);
    }
  }, [active, seconds]);

  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      setTimervalue((timer) => timer+1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    setmymillis(readings.lastReading.millis);
  }, [timer]);

  function sToTime(duration) {
    let seconds = Math.floor((duration /1000) % 60);
    let minutes = Math.floor((duration /1000 / 60) % 60);
    let hours = Math.floor((duration / 1000 /(60 * 60)) % 24);

    hours = hours.toString().padStart(2, "0");
    minutes = minutes.toString().padStart(2, "0");
    seconds = seconds.toString().padStart(2, "0");

    return (
      <span className={className} style={style}>
        {hours}:{minutes}:{seconds}
      </span>
    );
  }
  let timediff;
  if ( isActive ) {
    timediff = thresholdTime - mymillis;
    if (timediff <= 0) {
      timediff=0;
    }
  } else {
    timediff = 0
  }
  return <div>{sToTime(timediff)}</div>;
};

export default Timer;
