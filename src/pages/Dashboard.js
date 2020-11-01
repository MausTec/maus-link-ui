import React, {useContext, useState} from 'react';
import Stats from "../Stats";
import Graph from "../Graph";
import {Button, Container, Switch} from "react-materialize";
import {DeviceContext, DeviceMode, ReadingsContext} from "../DeviceProvider";

const Dashboard = () => {
  const context = useContext(DeviceContext);
  const readings = useContext(ReadingsContext);

  const onModeChange = (e) => {
    const auto = e.target.checked;
    const mode = auto ? DeviceMode.AUTOMATIC : DeviceMode.MANUAL;
    context.send({ setMode: mode });
  };

  const onStop = (e) => {
    e.preventDefault();

    context.send({
      setMode: DeviceMode.MANUAL,
      setMotor: 0
    });
  };

  const onJizzumPermitted = (e) => {
    e.preventDefault();

    context.send({
      setMode: DeviceMode.MANUAL,
      setMotor: 255
    });
  };

  return (
    <Container style={{ marginTop: '3rem' }}>
      <Stats />

      <div className={'row'} style={{ marginTop: '3rem' }}>
        <div className={'col s12 m4'}>
          <Button onClick={onStop} large disabled={ readings.lastReading.motor === 0} className={'red darken-2 block'}>STOP!</Button>
        </div>
        <div className={'col s12 m4'}>
          <div className={'center'} style={{ lineHeight: '54px' }}>
            <Switch
              id="ModeSwitch"
              offLabel="Manual"
              onChange={onModeChange}
              onLabel="Automatic"
              checked={context.mode === DeviceMode.AUTOMATIC}
            />
          </div>
        </div>
        <div className={'col s12 m4'}>
          <Button onClick={onJizzumPermitted} large disabled={ context.mode !== DeviceMode.AUTOMATIC } className={'green darken-2 block'}>Allow Orgasm</Button>
        </div>
      </div>

      <div className={'row'}>
        <div className={'col s12'}>
          <div className={'card'}>
            <div className={'card-content'}>
              <Graph />
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
};

export default Dashboard;
