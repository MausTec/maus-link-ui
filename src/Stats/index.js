import React, {useContext, useState, useEffect, useMemo} from 'react'
import LEDRing from "../LEDRing";
import Stat from "./Stat";
import {DeviceContext, DeviceMode, ReadingsContext} from "../DeviceProvider";
import {Switch} from "react-materialize";

const Stats = () => {
  const context = useContext(DeviceContext);
  const readings = useContext(ReadingsContext);
  const [sens, setsensVal] = useState(0);
  const [pavg, setpavgVal] = useState(0);
  const [arousalLimit, setlimitVal] = useState(0);
  const [motorSpeed, setspeedVal] = useState(0);
  const [arousal, setaarousalVal] = useState(0);
  const [runMode, setrunMode] = useState("manual");
  const [disabled, setDisabledState] = useState(false);
  let props = {};

  const onPeakLimitChange = (e) => {
    const sensitivity_threshold = e;
    context.send({
      configSet: {
        sensitivity_threshold
      }
    });
  };

  const onSpeedChange = (e) => {
    const motor = e;
    context.send({
      setMotor: motor
    });
  };

  const onSensitivityChange = (e) => {
    const sensor_sensitivity = e;
    context.send({
      configSet: {
        sensor_sensitivity
      }
    });
  };

  useEffect(() => {
    setpavgVal(readings.lastReading.pavg);
  }, [readings.lastReading.pavg]);

  useEffect(() => {
    setsensVal(context.config.sensor_sensitivity);
  }, [context.config.sensor_sensitivity]);

  useEffect(() => {
    setlimitVal(context.config.sensitivity_threshold);
  }, [context.config.sensitivity_threshold]);
  
  useEffect(() => {
    setspeedVal(readings.lastReading.motor);
  }, [readings.lastReading.motor]);

  useEffect(() => {
    setaarousalVal(readings.lastReading.arousal);
  }, [readings.lastReading.arousal]);

  useEffect(() => {
    setrunMode(context.mode);
    if (context.mode !== DeviceMode.MANUAL) {
      setDisabledState(true);
    } else {
      setDisabledState(false);
    }
  }, [context.mode]);
    
  ////////////////
  //  Props  
  const p_kpa_max = Math.floor(100 * ((255 - sens) / 255));
  const p_perc = pavg / 4095;
  const p_kpa = p_perc * p_kpa_max;

  const sensitivityProps = useMemo(
    () => ({
      value: sens,
      onChange: (e) => onSensitivityChange(e),
      max: 255,
      step: 1
    }), [sens]
  );

  const pressureProps = useMemo(
    () => ({
      value: p_kpa,
      min: 1,
      max: 0,
      step: 2,
      disabled: true
    }), [pavg]
  );

  const arousallimitProps = useMemo(
    () => ({
      value: arousalLimit,
      onChange: (e) => onPeakLimitChange(e),
      min: 0,
      max: 1023,
      step: 1
    }), [arousalLimit]
  );

  const motorProps = useMemo(
    () => ({
      value: motorSpeed,
      onChange: (e) => onSpeedChange(e),
      min: 0,
      max: context.config.motor_max_speed,
      step: 1,
      disabled: disabled
    }), [motorSpeed,disabled]
  );

  const arousalProps = useMemo(
    () => ({
      value: arousal,
      min: 0,
      max: arousalLimit,
      disabled: true
    }), [arousal]
  );

  return (
    <div className={'row'}>
      <div className={'col s12 m3'} style={{ margin: '2px auto' }}>
        <Stat name={"Pressure"} unit={'kPa'} round {...props={...pressureProps}} />
        <Stat name={"Sensitivity"} round style={{ marginTop: '2rem' }} {...props={...sensitivityProps}}/>
      </div>

      <div className={'col s12 m6'}>
        <LEDRing style={{ margin: '0px auto' }}>
          <Stat name={"Arousal"} round flipped {...props={...arousalProps}} />
        </LEDRing>
      </div>

      <div className={'col s12 m3'}style={{ margin: '2px auto' }}>
      <Stat name={"Speed"} round unit={'%'} {...props={...motorProps}} />
      <Stat name={"Arousal Limit"} style={{ marginTop: '2rem' }} {...props={...arousallimitProps}} />
      </div>
    </div>
  )
};
export default Stats;
