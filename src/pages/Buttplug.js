import React, {useContext} from 'react'
import {Button} from "react-materialize";
import {ReadingsContext} from "../DeviceProvider";
import {ButtplugContext, ButtplugState} from "../DeviceProvider/ButtplugProvider";

const Buttplug = () => {
  const readings = useContext(ReadingsContext);
  const buttplug = useContext(ButtplugContext);

  if (!window.Bluetooth) {
    return <div>Unsupported browser. Use Chrome like a normal person.</div>
  }

  return (
    <div>
      <h1>Buttplug.io Connection</h1>
      { (buttplug.state === ButtplugState.IDLE) && <Button onClick={e => buttplug.startPairing()}>Scan</Button> }
      { (buttplug.state === ButtplugState.PAIRING) && <Button onClick={e => buttplug.stopPairing()}>Stop Scan</Button> }
    </div>
  )
};

export default Buttplug;
