import React, {useContext, useState, useMemo, useEffect} from 'react';
import Stats from "../Stats";
import Graph from "../Graph";
import {Button, Container, Switch} from "react-materialize";
import {DeviceContext, DeviceMode, ReadingsContext} from "../DeviceProvider";
import RangeSlider from "../components/RangeSlider";
import Timer from "../components/timer";

const Dashboard = () => {
  const context = useContext(DeviceContext);
  const readings = useContext(ReadingsContext);
  const [edgedurationMinutes, setEdgeVal] = useState(0);
  const [postODurationSeconds, setPostOVal] = useState(0);
  const [mode, setmodeVal] = useState("Manual");
  const [isActiveTimer, setActiveTimer] = useState(false);
  const [timerSeconds, settimerSeconds] = useState(0);
  const [isOrgasm, setOrgams] = useState(false);
  const [isPermitOrgasm, setispermitorgasm] = useState(false);
  
  useEffect(() => {
    setEdgeVal(context.config.auto_edging_duration_minutes);
  }, [context.config.auto_edging_duration_minutes]);

  useEffect(() => {
    setPostOVal(context.config.post_orgasm_duration_seconds);
  }, [context.config.post_orgasm_duration_seconds]);

  useEffect(() => {
    setmodeVal(readings.lastReading.runmode)
    if ( readings.lastReading.runmode === "PostOrgasm" ) {
      settimerSeconds(edgedurationMinutes*60);
      setActiveTimer(true);
    } else {
      settimerSeconds(0);
      setActiveTimer(false);
    }
  }, [readings.lastReading.runmode]);

  useEffect(() => {
    setOrgams(readings.lastReading.postorgasm);
    if ( readings.lastReading.postorgasm ) {
      settimerSeconds(postODurationSeconds);
      setActiveTimer(true);
    }
  }, [readings.lastReading.postorgasm]);

  useEffect(() => {
    setispermitorgasm(readings.lastReading.permitorgasm);
  }, [readings.lastReading.permitorgasm]);

  const edgesliderValueChanged = (val) => {
    const command = "set auto_edging_duration_minutes " + val;
    context.send({serialCmd: {cmd: command}});
  };

  const postsliderValueChanged = (val) => {
    const command = "set post_orgasm_duration_seconds " + val;
    context.send({serialCmd: {cmd: command}});
  };

  const onModeChange = (e) => {
    const toMode = e.target.value;
    context.send({ setMode: toMode });
  };

  const onStop = (e) => {
    context.send({
      setMode: DeviceMode.MANUAL,
      setMotor: 0,
      lock: false
    });
    settimerSeconds(0);
    setActiveTimer(false);
  };

  const onJizzumPermitted = (e) => {
    const seconds = postODurationSeconds;
    context.send({
      lock: true,
      orgasm: seconds
    });
    settimerSeconds(0);
    setActiveTimer(false);
  };

  const onLockChange = (e) => {
    context.send({
      lock: e.target.checked,
    });
  }
  
///////////////////////////////////////
//// Props

  const edgesliderProps = useMemo(
    () => ({
      value: edgedurationMinutes,
      onChange: (e) => edgesliderValueChanged(e),
      id: "EdgeOrgasmslider",
      min: "1", 
      max: "120", 
      step: "1", 
      defaultValue: edgedurationMinutes, 
      className: 'primary-text darken-2 block'
    }), [edgedurationMinutes]
  );  

  const postsliderProps = useMemo(
    () => ({
      value: postODurationSeconds,
      onChange: (e) => postsliderValueChanged(e),
      id: "PostOtimeSlider",
      min: "0",
      max: "240", 
      step:"1",
      defaultValue: postODurationSeconds,
      className: 'primary-text darken-2 block'
    }), [postODurationSeconds]
  );

  ///////////////////////////////////////
  let lock = readings.lastReading.lock;
//  let isPermitOrgasm = readings.lastReading.permitorgasm;
//  let isPostorgasm = readings.lastReading.postorgasm;
  let orgasmStatus;
  let sliderProps = {};
  
  if ( isOrgasm ) {
    orgasmStatus = "Orgasm";
  } else if ( isPermitOrgasm ) {
    orgasmStatus = "Permit";
  } else {
    orgasmStatus = "Edging";
  }
  const PermitOrgasmCaption = {
    Orgasm: "Orgasm Detected",
    Permit: "Waiting Orgasm",
    Edging: "Give Orgasm"
  };

  return (
    <Container style={{ marginTop: '0rem' }}>
      <Stats />
      <div className={'row'} style={{ marginTop: '0rem' }}>
        <div className={'col s12 m3 centre'}>
          <Timer seconds={timerSeconds} active={isActiveTimer} className={'primary-text darken-2 block'} style={{ fontSize: '2rem', marginTop: '0rem', textAlign: 'center'}}/>
        </div>
        <div className={'col s12 m6 center'}>
          <form action="#" onChange={onModeChange} id="controlmode" defaultValue={ readings.lastReading.runmode }>
            <p>
              <label>
                <input class="with-gap" name="group1" type="radio" value="manual" checked={mode == "Manual"} />
                <span>Manual</span>
              </label>
              <label>
                <input class="with-gap" name="group1" type="radio" value="automatic" checked={mode == "Automatic"}/>
                <span>Auto Edging</span>
              </label>
              <label>
                <input class="with-gap" name="group1" type="radio" value="postorgasm" checked={mode == "PostOrgasm"}/>
                <span>Edging + Orgasm</span>
              </label>
            </p>
          </form>
        </div>
        <div className={'col s12 m3 center'} style={{ lineHeight: '54px' }}>
            <Switch
              id="LockSwitch"
              offLabel="Unlock"
              onChange={onLockChange}
              onLabel="Lock"
              disabled={mode == "Manual"}
              checked={lock}
            />
          </div>
      </div>
      <div className={'row'} style={{ marginTop: '0rem' }}>
        <div className={'col s12 m4'}>
          <Button onClick={onStop} large disabled={ readings.lastReading.motor === 0} className={'red darken-2 block'}>STOP!</Button>
        </div>
        <div className={'col s12 m4'}>
          <div className={'center'} style={{textAlign: 'start'}} >
            <div className={'center primary-text darken-2 block'} >Edging for {edgedurationMinutes}min to Orgasm</div>
            <RangeSlider {...sliderProps={...edgesliderProps}} />
            <RangeSlider {...sliderProps={...postsliderProps}} />
            { postODurationSeconds != 0 && <div className={'center primary-text darken-2 block'}>Post Orgasm {postODurationSeconds}sec Stimulation</div>}
            { postODurationSeconds == 0 && <div className={'center primary-text darken-2 block'}>Ruined Orgasm</div>}
          </div>
        </div>
        <div className={'col s12 m4'}>
          <Button onClick={onJizzumPermitted} large disabled={ context.mode === DeviceMode.MANUAL } className={'green darken-2 block'}>{PermitOrgasmCaption[orgasmStatus]}</Button>
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
