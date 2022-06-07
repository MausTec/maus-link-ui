import React, {useContext, useState} from 'react'
import LEDRing from "../LEDRing";
import Stat from "./Stat";
import {DeviceContext, DeviceMode, ReadingsContext} from "../DeviceProvider";
import {Switch} from "react-materialize";

const Stats = () => {
  const context = useContext(DeviceContext);
  const readings = useContext(ReadingsContext);

  const onSensitivityChange = (add) => {
    let { sensor_sensitivity = 0 } = context.config;
    sensor_sensitivity += add;
    context.send({
      configSet: {
        sensor_sensitivity
      }
    });
  };

  const onPeakLimitChange = (add) => {
    let { sensitivity_threshold = 0 } = context.config;
    sensitivity_threshold += add;
    context.send({
      configSet: {
        sensitivity_threshold
      }
    });
  };

  const onSpeedChange = (add) => {
    let { motor = 0 } = readings.lastReading;
    motor += add;
    context.send({
      setMotor: motor
    });
  };

  const config = context.config || {
    sensor_sensitivity: 0,
    sensitivity_threshold: 0,
  };

  const pavg = readings.lastReading.pavg || 0;
  const sens = config.sensor_sensitivity;
  const p_kpa_max = Math.floor(100 * ((255 - sens) / 255));
  const p_perc = pavg / 4095;
  const p_kpa = p_perc * p_kpa_max;

  return (
    <div className={'row'}>
      <div className={'col s12 m3'}>
        <Stat name={"Pressure"} value={p_kpa} unit={'kPa'} round />
        <Stat name={"Sensitivity"} round max={ 255 } step={ 2 } onChange={ onSensitivityChange } value={config.sensor_sensitivity} style={{ marginTop: '5rem' }}/>
      </div>

      <div className={'col s12 m6'}>
        <LEDRing style={{ margin: '15px auto' }}>
          <Stat name={"Arousal"} value={readings.lastReading.arousal} flipped max={ config.sensitivity_threshold } round />
        </LEDRing>
      </div>

      <div className={'col s12 m3'}>
        <Stat name={"Speed"} onChange={ context.mode === DeviceMode.MANUAL ? onSpeedChange : undefined } step={ 7 } value={(readings.lastReading.motor / 255) * 100} round unit={'%'} />
        <Stat name={"Arousal Limit"} onChange={ onPeakLimitChange } value={config.sensitivity_threshold} style={{ marginTop: '5rem' }}/>
      </div>
    </div>
  )
};

export default Stats;
