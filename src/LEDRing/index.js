import React, {useContext} from 'react'
import './index.scss'
import {DeviceContext, ReadingsContext} from "../DeviceProvider";

const radius = 250;
const ledCount = 13;
const startDeg = 40;
const endDeg = 360 - startDeg;
const interval = ((endDeg - startDeg) / (ledCount-1));

const rad = (deg) => deg * (Math.PI / 180);

const map = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

const LEDRing = (props) => {
  const context = useContext(DeviceContext);
  const readings = useContext(ReadingsContext);

  const {
    config: {
      sensitivity_threshold: limit = 0
    }
  } = context;

  const {
    lastReading: {
      pressure = 0,
      arousal = 0,
    }
  } = readings;

  const pressureIdx = Math.floor(map(pressure, 0, 4096, 0, ledCount - 1));
  const limitIdx = Math.floor(map(limit, 0, 4096, 0, ledCount - 1));
  const arousalIdx = Math.floor(map(arousal, 0, limit, 0, ledCount - 1));

  let leds = [];
  const showLimit = false;

  for (let i = 0; i < ledCount; i++) {
    const j = ledCount - i -1;
    const rot = startDeg + (interval * i);
    const x = (Math.sin(rad(rot)) * radius / 2) + radius / 2;
    const y = (Math.cos(rad(rot)) * radius / 2) + radius / 2;
    let l = 50;
    let h = 0;

    if (j === pressureIdx) {
      h = 290;
      l = 75;
    } else if (j === limitIdx && showLimit) {
      h = 210;
      l = 75;
    } else if (j < arousalIdx) {
      h = map(i, 0, ledCount - 1, 0, 120);
    } else {
      l = 100;
    }

    leds[i] = { color: `hsl(${h}, 100%, ${l}%)`, x, y, rot, glow: l < 100 }
  }

  return (
    <div className={'led-ring'} style={{ width: radius, height: radius, ...props.style }}>
      { leds.map((led, i) =>
        <div className={'led led-' + i} key={i} style={{
          backgroundColor: led.color,
          left: led.x,
          top: led.y,
          transform: `translate(-50%, -50%) rotate(-${led.rot}deg)`,
          boxShadow: (led.glow ? `0 0 10px 3px ${led.color}` : ""),
          opacity: (led.glow ? 1.0 : 0.8)
        }} />)}

      {/*<div className={'led-value'}>{ Math.floor(arousal / limit * 100) }%</div>*/}
      {/*<div className={'led-stat'}>Arousal</div>*/}
      { props.children }
    </div>
  )
};

export default LEDRing;
