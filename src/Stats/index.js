import React, {useContext, useState} from 'react'
import LEDRing from "../LEDRing";
import Stat from "./Stat";
import {DeviceContext, DeviceMode} from "../DeviceProvider";
import {Switch} from "react-materialize";

const Stats = () => {
  const context = useContext(DeviceContext);
  const [mode, setMode] = useState(context.mode);

  const onSensitivityChange = (add) => {
    let { pressureSensitivity = 0 } = context.config;
    pressureSensitivity += add;
    context.send({
      configSet: {
        pressureSensitivity
      }
    });
  };

  const onPeakLimitChange = (add) => {
    let { peakLimit = 0 } = context.config;
    peakLimit += add;
    context.send({
      configSet: {
        peakLimit
      }
    });
  };

  const onModeChange = (e) => {
    const auto = e.target.checked;
    const mode = auto ? DeviceMode.AUTOMATIC : DeviceMode.MANUAL;
    setMode(mode);
    context.send({ setMode: mode });
  };

  return (
    <div className={'row'}>
      <div className={'col s12 m3'}>
        <Stat name={"Pressure"} value={context.lastReading.pavg} />
        <Stat name={"Sensitivity"} onChange={ onSensitivityChange } value={context.config.pressureSensitivity} style={{ marginTop: '5rem' }}/>
      </div>

      <div className={'col s12 m6'}>
        <LEDRing style={{ margin: '15px auto' }}>
          <Stat name={"Arousal"} value={context.lastReading.arousal} flipped />
        </LEDRing>

        <div className={'center'}>
          <Switch
            id="ModeSwitch"
            offLabel="Manual"
            onChange={onModeChange}
            onLabel="Automatic"
            checked={mode === "automatic"}
          />
        </div>
      </div>

      <div className={'col s12 m3'}>
        <Stat name={"Speed"} value={context.lastReading.motor} />
        <Stat name={"Arousal Limit"} onChange={ onPeakLimitChange } value={context.config.peakSensitivity} style={{ marginTop: '5rem' }}/>
      </div>
    </div>
  )
};

export default Stats;
